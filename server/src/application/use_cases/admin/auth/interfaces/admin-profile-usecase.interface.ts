import type { AdminDTO } from "@application/dto/admin/admin-data.dto";

export interface IAdminProfileUseCase {
  execute(data: { id: string }): Promise<AdminDTO>;
}
