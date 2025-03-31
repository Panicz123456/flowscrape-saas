import { ExecutionEnvironment } from "@/types/executor";
import { DeliverViaWebhookTask } from "../task/DeliverViaWebhook";

export async function DeliverViaWebhookExecutor(
  environment: ExecutionEnvironment<typeof DeliverViaWebhookTask>
): Promise<boolean> {
  try {
    const URL = environment.getInput("Target URL");
    if (!URL) {
      environment.log.error("input->targetUrl not defined");
      return false
    }

    const body = environment.getInput("Body");
    if (!body) {
      environment.log.error("invalid body");
      return false
    }

    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const statusCode = response.status;
    if (statusCode !== 200) {
      environment.log.error(`code status: ${statusCode}`);
      return false;
    }

    const responseBody = await response.json();
    environment.log.info(JSON.stringify(responseBody, null, 4));

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
