import type { AdminEntity } from "@domain/entities/admin/admin.entity";
import { IBaseRepository } from "../base-repository.interface";
 
export interface IAdminRepository extends IBaseRepository<AdminEntity> {}
