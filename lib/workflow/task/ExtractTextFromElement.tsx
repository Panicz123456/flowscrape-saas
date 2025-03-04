import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { LucideProps, TextIcon } from "lucide-react";

export const ExtractTextFromElementTask = {
  type: TaskType.EXTRACT_TEXT_FROM_ELEMENT,
  label: "Extract text from element",
  icon: (props: LucideProps) => (
    <TextIcon className="stroke-pink-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 2,
  inputs: [
    {
      name: "Html",
      type: TaskParamType.STRING,
      require: true,
      variant: "textarea"
    },
    {
      name: "Selector",
      type: TaskParamType.STRING,
      require: true
    }
  ],
  outputs: [
    {
      name: "Extracted Text",
      type: TaskParamType.STRING
    },
  ]
} satisfies WorkflowTask;
