import type { IAdminRepository } from "@application/interfaces/repositories/admin.repository.interface";
import type { AdminEntity } from "@domain/entities/admin.entity";
import {
  type AdminDocument,
  AdminModel,
} from "@infrastructure/databases/mongo_db/models/schemas/admin.schema";
import { AdminMapper } from "@infrastructure/mappers/admin.mapper";
import { injectable } from "inversify";
import { BaseRepository } from "../base.repository";

@injectable()
export class AdminRepository extends BaseRepository<AdminEntity, AdminDocument> implements IAdminRepository
{
  constructor() {
    super(AdminModel, AdminMapper);
  }
}
