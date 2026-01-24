import type { AdminDTO } from "@application/dto/admin/admin-data.dto";
import { IAdminRepository } from "@application/interfaces/repositories/admin/admin.repository.interface";
import type { IAdminProfileUseCase } from "@application/use_cases/admin/interfaces/admin-profile-usecase.interface";
import { ADMIN_TYPES } from "@infrastructure/inversify_di/types/admin/admin.types";
import { inject, injectable } from "inversify";

@injectable()
export class AdminProfileUseCase implements IAdminProfileUseCase {
  constructor(
    @inject(ADMIN_TYPES.AdminRepository) private readonly _adminRepository: IAdminRepository,
  ) {}
  async execute(data: { id: string }): Promise<AdminDTO> {
    const isAdmin = await this._adminRepository.findById(data.id as string);

    return {
      adminCode: isAdmin?.adminCode as string,
      fullName: isAdmin?.fullName as string,
      email: isAdmin?.fullName as string,
    };
  }
}
