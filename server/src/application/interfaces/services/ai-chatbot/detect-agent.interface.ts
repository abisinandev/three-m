import { BaseMessageChunk } from "@langchain/core/messages";

export interface IDetectAgent {
  /**
   * Classifies the user's intent into 'simple', 'complex', or 'portfolio'.
   * @param message User's prompt
   */
  classifyIntent(message: string): "simple" | "complex" | "portfolio";

  /**
   * Directly invokes the LLM for simple queries with a system prompt.
   * @param message User's prompt
   */
  directLLM(message: string): Promise<BaseMessageChunk>;
}
