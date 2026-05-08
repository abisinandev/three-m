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
  REDIS_URL: requireEnv("REDIS_URL") || "redis://127.0.0.1:6379",

  EMAIL_USER: requireEnv("EMAIL_USER"),
  EMAIL_PASS: requireEnv("EMAIL_PASS"),

  FRONTEND_URL: requireEnv("FRONTEND_URL") || "http://localhost:5173",

  ACCESS_SECRET: requireEnv("JWT_ACCESS_SECRET"),
  REFRESH_SECRET: requireEnv("JWT_REFRESH_SECRET"),
  ACCESS_EXPIRES_IN: requireEnv("JWT_ACCESS_EXPIRES_IN"),
  REFRESH_EXPIRES_IN: requireEnv("JWT_REFRESH_EXPIRES_IN"),

  ADMIN_NAME: requireEnv("ADMIN_NAME"),
  ADMIN_CODE: requireEnv("ADMIN_CODE"),
  ADMIN_EMAIL: requireEnv("ADMIN_EMAIL"),
  ADMIN_PASSWORD: requireEnv("ADMIN_PASSWORD"),

  GOOGLE_AUTH_CLIENT_ID: requireEnv("GOOGLE_AUTH_CLIENT_ID"),
  GOOGLE_USER_INFO_URL: requireEnv("GOOGLE_USER_INFO_URL"),

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

  FINNHUB_API_KEY_SECRET: requireEnv('FINNHUB_API_KEY_SECRET'),
  FINNHUB_LOGO_URL: requireEnv("FINNHUB_LOGO_URL"),
  FINNHUB_BASE_URL: requireEnv("FINNHUB_BASE_URL"),
  FINNHUB_WEBSOCKET: requireEnv("FINNHUB_WEBSOCKET"),
  FINNHUB_QUOTE_PRICE: requireEnv("FINNHUB_QUOTE_PRICE"),
  FINNHUB_CANDLE: requireEnv("FINNHUB_CANDLE"),

  YAHOO_FINANCE_RSS_STOCKS: requireEnv("YAHOO_FINANCE_RSS_STOCKS"),
  YAHOO_FINANCE_RSS_CRYPTO: requireEnv("YAHOO_FINANCE_RSS_CRYPTO"),
  YAHOO_FINANCE_RSS_DEFAULT: requireEnv("YAHOO_FINANCE_RSS_DEFAULT"),

  GROQ_API_KEY: requireEnv("GROQ_API_KEY"),

  TWELVE_DATA_API_KEY: requireEnv("TWELVE_DATA_API_KEY"),
  TWELVE_DATA_API: requireEnv("TWELVE_DATA_API"),

  MF_API_URL: requireEnv("MF_API_URL"),
};
