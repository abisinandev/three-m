export interface IAgentService {
     generateResponse(systemPrompt: string, userInput: string): Promise<string>;
}