import "server-only";
import prisma from "../prisma";
import {revalidatePath} from "next/cache";
import {ExecutionPhaseStatus, WorkflowExecutionStatus} from "@/types/workflow";
import {ExecutionPhase} from "@prisma/client";
import {AppNode} from "@/types/appNode";
import {TaskRegistry} from "@/lib/workflow/task/registry";
import {TaskType} from "@/types/task";
import {ExecutionRegistry} from "@/lib/workflow/executor/registry";

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

  const environment = {
    phases: {}
  }

  await initializeWorkflowExecution(executionId, execution.workflowId)
  await initializePhaseStatus(execution)

  let creditConsumed = 0;
  let executionFailed = false;

  for (const phase of execution.phases) {
    // TODO: consume Credits
    const phaseExecution = await executeWorkflowPhase(phase)
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

  // TODO: clean up env

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

async function executeWorkflowPhase(phase: ExecutionPhase) {
  const startedAt = new Date();
  const node = JSON.parse(phase.node) as AppNode

  //Update phase status
  await prisma.executionPhase.update({
    where: {
      id: phase.id
    },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
    }
  })

  const creditsRequired = TaskRegistry[node.data.type].credits
  console.log(
    `Executing phase ${phase.name} with ${creditsRequired} credits Required`
  )

  // TODO: decrement user balance (with required credits)

  const success = Math.random() < 0.7

  await finalizePhase(phase.id, success)
  return {success}
}

async function finalizePhase(phaseId: string, success: boolean) {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED

  await prisma.executionPhase.update({
    where: {
      id: phaseId
    },
    data: {
      status: finalStatus,
      completedAt: new Date()
    }
  })
}

