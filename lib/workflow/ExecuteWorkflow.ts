import "server-only";
import prisma from "../prisma";
import {revalidatePath} from "next/cache";
import {ExecutionPhaseStatus, WorkflowExecutionStatus} from "@/types/workflow";

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
    // TODO: execution phases
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