import type { FetchDataResponseDTO } from "@application/dto/admin/fetch-data.response.dto";
import type { UserDTO } from "@application/dto/user/user-dto";
import { USER_TYPES } from "@infrastructure/inversify_di/types/user/user.types";
import { inject, injectable } from "inversify";
import type { QueryOptions } from "mongoose";
import type { IFetchUserDetails } from "../../interfaces/admin/fetch-user-details";
import { toUserResponse } from "@application/mappers/user/user.mapper";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";

@injectable()
export class FetchUserDetails implements IFetchUserDetails {
  constructor(
    @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
  ) { }

  async execute(data: QueryOptions): Promise<FetchDataResponseDTO<UserDTO>> {
    
    const allUsers = await this._userRepository.findWithFilters({
      search: data.search,
      page: data.page,
      limit: data.limit,
      sortBy: data.sortBy,
      sortOrder: data.sortOrder,
    });

    const { totalCount } = await this._userRepository.count();
    const { totalActiveUsersCount } = await this._userRepository.CountActiveUsers();
    const { totalInActiveUsersCount } = await this._userRepository.CountInActiveUsers();
    const { totalVerifiedUsersCount } = await this._userRepository.CountVerifiedUsers();

    return {
      data: allUsers.map((user) => toUserResponse(user)),
      total: totalCount,
      page: data.page || 1,
      limit: data.limit || 10,
      totalPages: Math.ceil(totalCount / (data.limit || 10)),
      totalActiveUsersCount,
      totalInActiveUsersCount,
      totalVerifiedUsersCount,
    };
  }
}
