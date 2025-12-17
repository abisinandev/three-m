import path from "node:path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
  quiet: true,
});

export const env = {
  //databases
  PORT: Number(process.env.PORT) || 9001,
  REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
  MONGO_URI: process.env.MONGO_URI,
  REDIS_URL: process.env.REDIS_URL || "redis://127.0.0.1:6379",

  //mail_service
  EMAIL_USER: process.env.EMAIL_USER || "",
  EMAIL_PASS: process.env.EMAIL_PASS || "",

  //frontend
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",

  //jwt_secrets
  ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
  REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
  ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN as string | number,
  REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN as string | number,

  //admin datas
  ADMIN_NAME: process.env.ADMIN_NAME,
  ADMIN_CODE: process.env.ADMIN_CODE,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,

  GOOGLE_AUTH_CLIENT_ID: process.env.GOOGLE_AUTH_CLIENT_ID,

  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET: process.env.CLOUDINARY_UPLOAD_PRESET,

  STRIPE_SCERET_KEY: process.env.STRIPE_SCERET_KEY ?? "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ?? ""
};
