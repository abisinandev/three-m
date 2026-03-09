export interface IDetectAgent {
    detectAgent(message: string): Promise<string>
}