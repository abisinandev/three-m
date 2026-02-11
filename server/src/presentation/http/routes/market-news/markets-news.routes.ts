import { container } from '@infrastructure/inversify_di/container';
import { MARKET_NEWS_TYPES } from '@infrastructure/inversify_di/features/market-news/market-news.types';
import { MarketNewsControllers } from '@presentation/http/controllers/market-news/market-news.controller';
import { Router } from 'express'
const router = Router();

const controller = container.get<MarketNewsControllers>(MARKET_NEWS_TYPES.MarketNewsControllers);

router.get("/", controller.getMarketNews.bind(controller));

export default router