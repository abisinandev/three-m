import { container } from '@infrastructure/inversify_di/container';
import { AI_SYSTEM_TYPES } from '@infrastructure/inversify_di/features/ai-system/ai-system.type';
import { AiChatbotController } from '@presentation/http/controllers/ai-chatbot/ai-chatbot.controller';
import { ChatbotRoutes } from '@shared/routes/chatbot.routes';
import { Router } from 'express';

const router = Router();
const controller = container.get<AiChatbotController>(AI_SYSTEM_TYPES.AiChatbotController);

router.post(ChatbotRoutes.CHAT, controller.chat.bind(controller));
router.get(ChatbotRoutes.HISTORY, controller.getHistory.bind(controller));

export default router;