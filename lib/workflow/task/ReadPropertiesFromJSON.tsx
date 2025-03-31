import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { FileJson2Icon, LucideProps } from "lucide-react";

export const ReadPropertiesFromJSONTask = {
  type: TaskType.READ_PROPERTIES_FROM_JSON,
  label: "Read Properties from JSON",
  icon: (props: LucideProps) => (
    <FileJson2Icon className="stroke-orange-400" {...props} />
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
  ] as const,
  outputs: [
    {
      name: "Property value",
      type: TaskParamType.STRING,
    },
  ] as const,
} satisfies WorkflowTask;
