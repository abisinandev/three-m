export interface IAgentRouter {
    route(agentName: string, input: string): Promise<string>;
}
