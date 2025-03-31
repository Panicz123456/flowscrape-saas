import { ExecutionEnvironment } from "@/types/executor";
import { AddPropertiesToJsonTask } from "../task/AddPropertiesToJson";

export async function AddPropertiesToJsonExecutor(
  environment: ExecutionEnvironment<typeof AddPropertiesToJsonTask>
): Promise<boolean> {
  try {
    let jsonData = environment.getInput("JSON");
    if (!jsonData) {
      environment.log.error("input -> JSON is not defined");
      return false;
    }

    const propertyName = environment.getInput("Propertied Name");
    if (!propertyName) {
      environment.log.error("input -> PropertyName is not defined");
      return false;
    }

    const propertyValue = environment.getInput("Propertied Value");
    if (!propertyName) {
      environment.log.error("input -> PropertyValue is not defined");
      return false;
    }

    const json = JSON.parse(jsonData);
    json[propertyName] = propertyValue;

    environment.setOutput("Updated Json value", JSON.stringify(json));

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
