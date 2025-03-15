import puppeteer from 'puppeteer'
import {Environment, ExecutionEnvironment} from "@/types/executor";
import {LaunchBrowserTask} from "@/lib/workflow/task/LaunchBrowser";

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  try {
    const websiteUrl = environment.getInput("Website Url");
    const browser = await puppeteer.launch({
      headless: false, // for testing
    })
    environment.setBrowser(browser)
    const page = await browser.newPage();
    await page.goto(websiteUrl);
    environment.setPage(page)
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}
