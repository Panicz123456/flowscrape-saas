import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { DatabaseIcon, LucideProps } from "lucide-react";

export const AddPropertiesToJsonTask = {
  type: TaskType.ADD_PROPERTIES_TO_JSON,
  label: "Add Properties To Json",
  icon: (props: LucideProps) => (
    <DatabaseIcon className="stroke-orange-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "JSON",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Propertied Name",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Propertied Value",
      type: TaskParamType.STRING,
      required: true,
    },
  ] as const,
  outputs: [
    {
      name: "Updated Json value",
      type: TaskParamType.STRING,
    },
  ] as const,
} satisfies WorkflowTask;
