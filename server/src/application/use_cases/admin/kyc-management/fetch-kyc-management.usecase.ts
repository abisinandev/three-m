import type { FetchDataResponseDTO } from "@application/dto/admin/fetch-data.response.dto";
import type { KycResponseDTO } from "@application/dto/user/kyc-response.dto";
import { IKycRepository } from "@application/interfaces/repositories/user/kyc-repository.interface";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { toKycResponse } from "@application/mappers/user/kyc.mapper";
import type { IFetchAllKycDocsUseCase } from "@application/use_cases/admin/kyc-management/interfaces/kyc-management-usecase.interface";
import type { UserEntity } from "@domain/entities/user/user.entity";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { inject, injectable } from "inversify";
import type { QueryOptions } from "mongoose";

@injectable()
export class FetchAllKycDocsUseCase implements IFetchAllKycDocsUseCase {
  constructor(
    @inject(USER_TYPES.KycRepository) private readonly _kycRepository: IKycRepository,
    @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
  ) { }

  async execute(options: QueryOptions): Promise<FetchDataResponseDTO<KycResponseDTO>> {
    const allDocs = await this._kycRepository.findWithFilters(options);

    const fullData = await Promise.all(
      allDocs.map(async (doc) => {
        const user = await this._userRepository.findById(doc.userId);
        return { kyc: doc, user };
      }),
    );

    const { totalCount } = await this._kycRepository.count();
    console.log(fullData);
    return {
      data: fullData.map(({ kyc, user }) =>
        toKycResponse(kyc, user as UserEntity),
      ),
      total: totalCount,
      page: options.page || 1,
      limit: options.limit || 10,
      totalPages: Math.ceil(totalCount / (options.limit || 10)),
    };
  }
}
