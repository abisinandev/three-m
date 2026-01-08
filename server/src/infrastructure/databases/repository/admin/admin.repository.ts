import { AdminMapper } from "@infrastructure/mappers/admin/admin.mapper";
import { injectable } from "inversify";
import { BaseRepository } from "../base.repository";
import { AdminEntity } from "@domain/entities/admin/admin.entity";
import { IAdminRepository } from "@application/interfaces/repositories/admin/admin.repository.interface";
import { AdminDocument, AdminModel } from "@infrastructure/databases/mongo_db/models/schemas/admin/admin.schema";

@injectable()
export class AdminRepository extends BaseRepository<AdminEntity, AdminDocument> implements IAdminRepository
{
  constructor() {
    super(AdminModel, AdminMapper);
  }
}
