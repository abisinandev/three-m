export interface IEducationAgentService {
    getResponses(userInput: string): Promise<string>
}