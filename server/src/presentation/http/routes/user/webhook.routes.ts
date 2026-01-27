import { container } from '@infrastructure/inversify_di/container';
import { WebhookController } from '@presentation/http/controllers/payment/webhook.controller';
import { Router } from 'express';
import express from 'express';
 
const router = Router();

const webhookController = container.get<WebhookController>(WebhookController);

router.post(
    '/stripe',
    express.raw({ type: 'application/json' }),
    webhookController.stripeWebhookHandler.bind(webhookController)
);

export default router;
