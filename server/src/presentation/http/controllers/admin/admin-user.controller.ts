import type { IBlockUserUseCase } from "@application/use_cases/admin/user-management/interfaces/block-user-usecase.interface";
import type { IFetchUserDetails } from "@application/use_cases/admin/user-management/interfaces/fetch-user-details.interface";
import type { IUnblockUserUsecase } from "@application/use_cases/admin/user-management/interfaces/unblock-user-usecase.interface";
import { SuccessMessage } from "@domain/enum/express/messages/success.message";
import { HttpStatus } from "@domain/enum/express/status-code";
import { ADMIN_TYPES } from "@infrastructure/inversify_di/features/admin/admin.types";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { IdProtector } from "@shared/utils/id-protector.util";
import { type NextFunction, type Request, type Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class AdminUserController {
  constructor(
    @inject(ADMIN_TYPES.FetchUserDetails) private readonly _fetchUserDetails: IFetchUserDetails,
    @inject(ADMIN_TYPES.BlockUserUseCase) private readonly _blockUserUsecase: IBlockUserUseCase,
    @inject(ADMIN_TYPES.UnblockUserUsecase) private readonly _unblockUserUsecase: IUnblockUserUsecase,
  ) { }

  async fetchUserDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this._fetchUserDetails.execute(req.query);
      return ResponseHelper.success(
        res,
        SuccessMessage.DATA_FETCHED,
        result,
        HttpStatus.OK,
      );

    } catch (error) {
      next(error);
    }
  }

  async blockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const decodedId = IdProtector.decodeId(userId as string);
      await this._blockUserUsecase.execute(decodedId);

      return ResponseHelper.success(
        res,
        SuccessMessage.BLOCKED_MSG,
        HttpStatus.OK,
      );

    } catch (error) {
      next(error);
    }
  }

  async unblockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const decodedId = IdProtector.decodeId(userId as string);

      await this._unblockUserUsecase.execute(decodedId);

      return ResponseHelper.success(
        res,
        SuccessMessage.UNBLOCK_MSG,
        HttpStatus.OK,
      );

    } catch (error) {
      next(error);
    }
  }
}
