import { injectable, inject } from "inversify";
import { IAgent } from "@application/interfaces/services/ai-chatbot/agent.interface";
import { IAgentRouter } from "@application/interfaces/services/ai-chatbot/agent-router.interface";
import { AI_SYSTEM_TYPES } from "@infrastructure/inversify_di/features/ai-system/ai-system.type";

@injectable()
export class AgentRouter implements IAgentRouter {

    private readonly agentMap: Map<string, IAgent>;

    constructor(
        @inject(AI_SYSTEM_TYPES.AgentList) agents: IAgent[]
    ) {
        const agentList = Array.isArray(agents) ? agents : [agents];
        this.agentMap = new Map(agentList.map(agent => [agent.name, agent]));
    }

    async route(agentName: string, input: string): Promise<string> {
        const agent = this.agentMap.get(agentName);

        if (!agent) {
            return `I'm sorry, I don't have an agent configured to handle "${agentName}" requests yet.`;
        }

        return agent.handle(input);
    }
}
