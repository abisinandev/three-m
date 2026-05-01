import path from "node:path";
import dotenv from "dotenv";
import { logger } from "@infrastructure/providers/logger/pino.logger";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
  quiet: true,
});

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    logger.error(`Missing environment variable: ${name}`);
    process.exit(1);
  }
  return value;
}

export const env = {
  PORT: Number(process.env.PORT) || 9001,
  REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,

  MONGO_URI: requireEnv("MONGO_URI"),
  REDIS_URL: process.env.REDIS_URL || "redis://127.0.0.1:6379",

  EMAIL_USER: requireEnv("EMAIL_USER"),
  EMAIL_PASS: requireEnv("EMAIL_PASS"),

  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",

  ACCESS_SECRET: requireEnv("JWT_ACCESS_SECRET"),
  REFRESH_SECRET: requireEnv("JWT_REFRESH_SECRET"),
  ACCESS_EXPIRES_IN: requireEnv("JWT_ACCESS_EXPIRES_IN"),
  REFRESH_EXPIRES_IN: requireEnv("JWT_REFRESH_EXPIRES_IN"),

  ADMIN_NAME: requireEnv("ADMIN_NAME"),
  ADMIN_CODE: requireEnv("ADMIN_CODE"),
  ADMIN_EMAIL: requireEnv("ADMIN_EMAIL"),
  ADMIN_PASSWORD: requireEnv("ADMIN_PASSWORD"),

  GOOGLE_AUTH_CLIENT_ID: requireEnv("GOOGLE_AUTH_CLIENT_ID"),

  CLOUDINARY_API_SECRET: requireEnv("CLOUDINARY_API_SECRET"),
  CLOUDINARY_API_KEY: requireEnv("CLOUDINARY_API_KEY"),
  CLOUDINARY_CLOUD_NAME: requireEnv("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_UPLOAD_PRESET: requireEnv("CLOUDINARY_UPLOAD_PRESET"),

  STRIPE_SECRET_KEY: requireEnv("STRIPE_SECRET_KEY"),
  STRIPE_WEBHOOK_SECRET: requireEnv("STRIPE_WEBHOOK_SECRET"),

  TRANSACTION_SIGNATURE: requireEnv("TRANSACTION_SIGNATURE"),

  MARKET_NEWS_API_KEY: requireEnv("MARKET_NEWS_API_KEY"),
  MARKET_NEWS_API: requireEnv("MARKET_NEWS_API"),

  OPENAI_API_KEY: requireEnv("OPENAI_API_KEY"),

  PINECONE_API_KEY: requireEnv("PINECONE_API_KEY"),
  PINECONE_INDEX_NAME: requireEnv("PINECONE_INDEX_NAME"),

  // ALPHA_VANTAGE_API_KEY: requireEnv("ALPHA_VANTAGE_API_KEY"),
  // ALPHA_VANTAGE_BASE_URL: requireEnv("ALPHA_VANTAGE_BASE_URL"),

  FINNHUB_API_KEY_SECRET: requireEnv('FINNHUB_API_KEY_SECRET'),
  FINNHUB_LOGO_URL: requireEnv("FINNHUB_LOGO_URL"),
  FINNHUB_BASE_URL: requireEnv("FINNHUB_BASE_URL"),
  FINNHUB_WEBSOCKET: requireEnv("FINNHUB_WEBSOCKET"),
  FINNHUB_QUOTE_PRICE: requireEnv("FINNHUB_QUOTE_PRICE"),
  FINNHUB_CANDLE: requireEnv("FINNHUB_CANDLE"),

  // POLYGON_API_KEY: requireEnv("POLYGON_API_KEY"),

  // ALPACA_API_KEY: requireEnv("ALPACA_API_KEY"),
  // ALPACA_API_SECRET: requireEnv("ALPACA_API_SECRET"),
  // ALPACA_BASE_URL: requireEnv("ALPACA_BASE_URL"),

  YAHOO_FINANCE_RSS_STOCKS: process.env.YAHOO_FINANCE_RSS_STOCKS || "https://finance.yahoo.com/topic/stock-market-news/rss/",
  YAHOO_FINANCE_RSS_CRYPTO: process.env.YAHOO_FINANCE_RSS_CRYPTO || "https://finance.yahoo.com/topic/crypto/rss/",
  YAHOO_FINANCE_RSS_DEFAULT: process.env.YAHOO_FINANCE_RSS_DEFAULT || "https://finance.yahoo.com/rss/",
};
