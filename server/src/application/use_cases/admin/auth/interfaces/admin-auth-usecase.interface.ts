import type { AdminAuthDTO } from "@application/dto/admin/admin-auth.dto";
import type { AdminAuthReponseDTO } from "@application/dto/admin/admin-auth.response.dto";

export interface IAdminAuthUseCase {
  execute(data: AdminAuthDTO): Promise<AdminAuthReponseDTO>;
}
