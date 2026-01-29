import { Role } from "@domain/enum/users/user-role.enum";
import { model, Schema } from "mongoose";
import { IAdminSchema } from "../../interfaces/admin/admin.schema.interface";

export type AdminDocument = Document & IAdminSchema;

const AdminSchema = new Schema<AdminDocument>(
  {
    adminCode: { type: String, unique: true, index: true, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(Role), default: Role.ADMIN },
    isBlocked: { type: Boolean, default: false },
    permissions: { type: String, default: null },
    profile: { type: String, default: null },
  },
  { timestamps: true },
);

export const AdminModel = model<AdminDocument>("Admin", AdminSchema);