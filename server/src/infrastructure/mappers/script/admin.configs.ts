import { Role } from "@domain/enum/users/user-role.enum";
import { AdminModel } from "@infrastructure/databases/mongo_db/models/schemas/admin/admin.schema";
import connectDB from "@infrastructure/databases/mongo_db/mongo.db";
import { env } from "@presentation/express/utils/constants/env.constants";
import argon2 from "argon2";

export const AdminConfig = {
  adminCode: env.ADMIN_CODE,
  fullName: env.ADMIN_NAME,
  email: env.ADMIN_EMAIL,
  password: env.ADMIN_PASSWORD,
  role: Role.ADMIN,
} as const;

export async function seedAdmin() {
  await connectDB();

  const existing = await AdminModel.findOne({ email: AdminConfig.email });

  if (existing) {
    console.log("✔ Admin already exists. No action needed.");
    return process.exit(0);
  }

  console.log("⏳ Creating Admin...");

  await AdminModel.create({
    adminCode: AdminConfig.adminCode,
    fullName: AdminConfig.fullName,
    email: AdminConfig.email,
    password: await argon2.hash(AdminConfig.password as string, {
      parallelism: 2,
    }),
    role: AdminConfig.role,
  });

  console.log("🎉 Admin created successfully!");
  process.exit(0);
}
