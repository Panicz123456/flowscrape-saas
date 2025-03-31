import { ExecutionEnvironment } from "@/types/executor";
import { ReadPropertiesFromJSONTask } from "../task/ReadPropertiesFromJSON";

export async function ReadPropertyFromJsonExecutor(
  environment: ExecutionEnvironment<typeof ReadPropertiesFromJSONTask>
): Promise<boolean> {
  try {
    let jsonData = environment.getInput("JSON");
    if (!jsonData) {
      environment.log.error("input -> JSON is not defined");
      return false;
    }
    const propertyName = environment.getInput("Propertied Name");

    if (!propertyName) {
      environment.log.error("input -> Property is not defined");
      return false;
    }
    const json = JSON.parse(jsonData);

    const propertyValue = json[propertyName];

    if (!propertyValue) {
      environment.log.error("Property not found");
      return false;
    }

    environment.setOutput("Property value", propertyValue);

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
