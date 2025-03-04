import { AppNode } from "@/types/appNode";
import {
  WorkflowExecutionPlan,
  WorkflowExecutionPlanPhase,
} from "@/types/workflow";
import { Edge, getIncomers } from "@xyflow/react";
import { TaskRegistry } from "./task/registry";

type FlowToExecutionPlanType = {
  executionPlan?: WorkflowExecutionPlan;
};

export function FlowToExecutionPlan(
  nodes: AppNode[],
  edges: Edge[]
): FlowToExecutionPlanType {
  const entryPoint = nodes.find(
    (node) => TaskRegistry[node.data.type].isEntryPoint
  );

  if (!entryPoint) {
    throw new Error("TODO: Handle this error");
  }

  const planned = new Set<string>();
  const executionPlan: WorkflowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint],
    },
  ];

  planned.add(entryPoint.id); // Mark entry point as planned

  // Loop through phases and nodes
  for (
    let phase = 2;
    phase <= nodes.length && planned.size < nodes.length;
    phase++
  ) {
    const nextPhase: WorkflowExecutionPlanPhase = { phase, nodes: [] };

    for (const currentNode of nodes) {
      if (planned.has(currentNode.id)) {
        // Node already in execution plan, skip it
        continue;
      }

      const invalidInputs = getInvalidInputs(currentNode, edges, planned);

      // If node has invalid inputs, check if incomers are planned
      if (invalidInputs?.length > 0) {
        const incomers = getIncomers(currentNode, nodes, edges);
        // If all incoming nodes are planned, proceed
        if (incomers.every((incomer) => planned.has(incomer.id))) {
          console.error("Invalid Inputs", currentNode.id, invalidInputs);
          throw new Error("TODO: HANDLE ERROR 1")
        } else {
          // Skip the node if incomers are not planned
          continue;
        }
      }

      // Add node to the next phase
      nextPhase.nodes.push(currentNode);
    }``

    // Add the phase to the execution plan
    for (const node of nextPhase.nodes) { 
      planned.add(node.id);
    }
    executionPlan.push(nextPhase);
  }

  return { executionPlan };
}

function getInvalidInputs(node: AppNode, edges: Edge[], planned: Set<string>) {
  const invalidInputs = [];
  const inputs = TaskRegistry[node.data.type].inputs;

  // Loop through each input of the node

  
  for (const input of inputs) {
    const inputValue = node.data.inputs[input.name];
    const inputValueProvided = inputValue?.length > 0;

    if (inputValueProvided) {
      // Input value is provided, skip further checks
      continue;
    }

    // Check if there is an output linked to the current input
    const incomingEdges = edges.filter((edge) => edge.target === node.id);
    const inputLinkedToOutput = incomingEdges.find(
      (edge) => edge.targetHandle === input.name
    );

    const requiredInputProvidedByVisitedOutput =
      input.required &&
      inputLinkedToOutput &&
      planned.has(inputLinkedToOutput.source);

    if (requiredInputProvidedByVisitedOutput) {
      // The input is required and value is provided from a planned node
      continue;
    } else if (!input.required) {
      // If input is not required, but there is an output linked to it
      if (!inputLinkedToOutput) continue;

      if (planned.has(inputLinkedToOutput.source)) {
        continue;
      }
    }

    // If no valid input or output is found, mark the input as invalid
    invalidInputs.push(input.name);
  }

  return invalidInputs;
}
