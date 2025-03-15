import { ExecutionEnvironment} from "@/types/executor";
import {ExtractTextFromElementTask} from "@/lib/workflow/task/ExtractTextFromElement";
import * as cheerio from 'cheerio'

export async function ExtractTextFromElementExecutor(
  environment: ExecutionEnvironment<typeof ExtractTextFromElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector")
    if (!selector) {
      console.error("selector not found")
      return false;
    }
    const html  = environment.getInput("Html")
    if (!html) {
      console.error("html not found")
      return false;
    }

    const $ = cheerio.load(html);
    const element = $(selector);

    if (!element) {
      console.error("Element not found")
      return false
    }

    const extractedText = $.text(element)
    if(!extractedText) {
      console.error("Element has no text")
      return false
    }

    environment.setOutput("Extracted Text", extractedText)

    return true
  } catch (error) {
    console.log(error)
    return false
  }
}
