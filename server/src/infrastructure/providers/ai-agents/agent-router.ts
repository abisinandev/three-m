// import { IAgent } from "@application/interfaces/services/ai-chatbot/agent.interface";
// import { IAgentRouter } from "@application/interfaces/services/ai-chatbot/agent-router.interface";
// import { IEducationAgent } from "@application/interfaces/services/ai-chatbot/education-agent.interface";
// import { ChatMessage } from "@application/interfaces/models/chat-message.interface";
// import { AI_SYSTEM_TYPES } from "@infrastructure/inversify_di/features/ai-system/ai-system.type";
// import { injectable, inject } from "inversify";

// @injectable()
// export class AgentRouter implements IAgentRouter {

//     private readonly agentMap: Map<string, IAgent>;

//     constructor(
//         @inject(AI_SYSTEM_TYPES.EducationAgent) educationAgent: IEducationAgent,
//     ) {
//         this.agentMap = new Map<string, IAgent>([
//             [educationAgent.name, educationAgent],
//         ]);
//     }

//     async route(agentName: string, input: string, history: ChatMessage[]): Promise<string> {
//         const agent = this.agentMap.get(agentName);

//         if (!agent) {
//             return `I'm sorry, I don't have an agent configured to handle "${agentName}" requests yet.`;
//         }

//         return agent.handle(input, history);
//     }
// }
