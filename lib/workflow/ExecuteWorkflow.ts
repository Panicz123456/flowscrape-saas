import "server-only";
import prisma from "../prisma";
import {revalidatePath} from "next/cache";
import {ExecutionPhaseStatus, WorkflowExecutionStatus} from "@/types/workflow";
import {ExecutionPhase} from "@prisma/client";
import {AppNode} from "@/types/appNode";
import {TaskRegistry} from "@/lib/workflow/task/registry";
import {ExecutorRegistry} from "@/lib/workflow/executor/registry";
import {Environment, ExecutionEnvironment} from "@/types/executor";
import {TaskParamType} from "@/types/task";
import {Browser, Page} from "puppeteer";
import {Edge} from "@xyflow/react";

export async function ExecutionWorkflow(executionId: string) {
  const execution = await prisma.workflowExecution.findUnique({
    where: {
      id: executionId,
    },
    include: {
      workflow: true,
      phases: true,
    },
  });

  if (!execution) {
    throw new Error("execution not found");
  }

  const edges = JSON.parse(execution.definition).edges as Edge[]

  const environment: Environment = {phases: {}}

  await initializeWorkflowExecution(executionId, execution.workflowId)
  await initializePhaseStatus(execution)

  let creditConsumed = 0;
  let executionFailed = false;

  for (const phase of execution.phases) {
    // TODO: consume Credits
    const phaseExecution = await executeWorkflowPhase(phase, environment, edges)
    if (!phaseExecution.success) {
      executionFailed = false;
      break;
    }
  }

  await finalizeWorkflowExecution(
    executionId,
    execution.workflowId,
    executionFailed,
    creditConsumed
  );

  await cleanupEnvironment(environment)
  revalidatePath("/workflow/runs");
}

async function initializeWorkflowExecution(
  executionId: string,
  workflowId: string
) {
  await prisma.workflowExecution.update({
    where: {
      id: executionId,
    },
    data: {
      startedAt: new Date(),
      status: WorkflowExecutionStatus.RUNNING
    }
  })

  await prisma.workflow.update({
    where: {
      id: workflowId
    },
    data: {
      lastRunAt: new Date(),
      lastRunId: executionId,
      lastRunStatus: WorkflowExecutionStatus.RUNNING,
    }
  })
}

async function initializePhaseStatus(execution: any) {
  await prisma.executionPhase.updateMany({
    where: {
      id: {
        in: execution.phases.map((phase: any) => phase.id)
      }
    },
    data: {
      status: ExecutionPhaseStatus.PENDING,
    }
  })
}

async function finalizeWorkflowExecution(
  executionId: string,
  workflowId: string,
  executionFailed: boolean,
  creditConsumed: number
) {
  const finalStatus = executionFailed
    ? WorkflowExecutionStatus.FAILED
    : WorkflowExecutionStatus.COMPLETED

  await prisma.workflowExecution.update({
    where: {
      id: executionId
    },
    data: {
      status: finalStatus,
      competedAt: new Date(),
      creditConsumed,
    }
  })

  await prisma.workflow.update({
    where: {
      id: workflowId,
      lastRunId: executionId,
    },
    data: {
      lastRunStatus: finalStatus,
    }
  }).catch((err) => {
    console.log(err)
  })
}

async function executeWorkflowPhase(
  phase: ExecutionPhase,
  environment: Environment,
  edges: Edge[]
) {
  const startedAt = new Date();
  const node = JSON.parse(phase.node) as AppNode
  setupEnvironmentForPhase(node, environment, edges)

  //Update phase status
  await prisma.executionPhase.update({
    where: {
      id: phase.id
    },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
      inputs: JSON.stringify(environment.phases[node.id].inputs)
    }
  })

  const creditsRequired = TaskRegistry[node.data.type].credits
  console.log(
    `Executing phase ${phase.name} with ${creditsRequired} credits Required`
  )

  // TODO: decrement user balance (with required credits)

  const success = await executePhase(phase, node, environment)

  const outputs = environment.phases[node.id].outputs;
  await finalizePhase(phase.id, success, outputs)
  return {success}
}

async function finalizePhase(phaseId: string, success: boolean, outputs: any) {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED

  await prisma.executionPhase.update({
    where: {
      id: phaseId
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      outputs: JSON.stringify(outputs),
    }
  })
}

async function executePhase(
  phase: ExecutionPhase,
  node: AppNode,
  environment: Environment,
): Promise<boolean> {
  const runFc = ExecutorRegistry[node.data.type];
  if (!runFc) {
    return false
  }

  const executionEnvironment: ExecutionEnvironment<any> =
    createExecutionEnvironment(node, environment);

  return await runFc(executionEnvironment)
}

function setupEnvironmentForPhase(node: AppNode, environment: Environment, edges: Edge[]) {
  environment.phases[node.id] = {inputs: {}, outputs: {}}
  const inputs = TaskRegistry[node.data.type].inputs
  for (const input of inputs) {
    if (input.type === TaskParamType.BROWSER_INSTANCE) continue
    const inputValue = node.data.inputs[input.name]
    if (inputValue) {
      environment.phases[node.id].inputs[input.name] = inputValue;
      continue;
    }

    const connectedEdges = edges.find(
      (edge) => edge.target === node.id && edge.targetHandle === input.name
    )

    if (!connectedEdges) {
      console.error("Missing edge for input", input.name, "node id:", node.id)
      continue;
    }

    const outputValue =
      environment.phases[connectedEdges.source].outputs[
        connectedEdges.sourceHandle!
        ];

    environment.phases[node.id].inputs[input.name] = outputValue
  }
}

function createExecutionEnvironment(
  node: AppNode,
  environment: Environment
): ExecutionEnvironment<any> {
  return {
    getInput: (name: string) => environment.phases[node.id]?.inputs[name],
    setOutput: (name: string, value: string) => {
      environment.phases[node.id].outputs[name] = value
    },

    getBrowser: () => environment.browser,
    setBrowser: (browser: Browser) => environment.browser = browser,

    getPage: () => environment.page,
    setPage: (page: Page) => environment.page = page
  }
}

async function cleanupEnvironment(environment: Environment) {
  if (environment.browser) {
    await environment.browser
      .close()
      .catch(err => console.log("cannot close browser, reason:", err))
  }
}
