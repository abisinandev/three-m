import { AdminEntity } from "@domain/entities/admin.entity";
import type { AdminDocument } from "@infrastructure/databases/mongo_db/models/schemas/admin.schema";

export const toDomain = (doc: AdminDocument): AdminEntity => {
  return AdminEntity.reconstitute({
    id: doc._id.toString(),
    adminCode: doc.adminCode,
    fullName: doc.fullName,
    email: doc.email,
    password: doc.password,
    role: doc.role,
    permissions: doc.permissions,
    isBlocked: doc.isBlocked,
    profile: doc.profile,
    createdAt: doc.createdAt ?? undefined, 
  });
};

export const toPersistance = (data: AdminEntity): Partial<AdminDocument> => {
  return {
    adminCode: data.adminCode,
    fullName: data.fullName,
    email: data.email,
    password: data.password,
    role: data.role,
    isBlocked: data.isBlocked,
    createdAt: data.createdAt,
    profile: data.profile,
    permissions: data.permissions,
  };
};

export const AdminMapper = {
  toDomain,
  toPersistance,
};
