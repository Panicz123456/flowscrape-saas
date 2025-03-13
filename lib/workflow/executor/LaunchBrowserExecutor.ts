import puppeteer from 'puppeteer'
import {Environment, ExecutionEnvironment} from "@/types/executor";

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment
): Promise<boolean> {
  try {
    const websiteUrl = environment.getInput("Website Url");
    console.log( "@@WEBSITE URL",websiteUrl);
    const browser = await puppeteer.launch({
      headless: false // for testing
    })
    await browser.close()
    return true

  } catch (error) {
    console.log(error)
    return false
  }
}