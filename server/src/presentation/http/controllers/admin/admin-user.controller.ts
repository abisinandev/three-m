import type { IBlockUserUseCase } from "@application/use_cases/interfaces/admin/block-user-usecase.interface";
import type { IFetchUserDetails } from "@application/use_cases/interfaces/admin/fetch-user-details";
import type { IUnblockUserUsecase } from "@application/use_cases/interfaces/admin/unblock-user-usecase.interface";
import { SuccessMessage } from "@domain/enum/express/messages/success.message";
import { HttpStatus } from "@domain/enum/express/status-code";
import { ADMIN_TYPES } from "@infrastructure/inversify_di/types/admin/admin.types";
import { type NextFunction, type Request, type Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class AdminUserController {
  constructor(
    @inject(ADMIN_TYPES.FetchUserDetails) private readonly _fetchUserDetails: IFetchUserDetails,
    @inject(ADMIN_TYPES.BlockUserUseCase) private readonly _blockUserUsecase: IBlockUserUseCase,
    @inject(ADMIN_TYPES.UnblockUserUsecase) private readonly _unblockUserUsecase: IUnblockUserUsecase,
  ) {}

  async fetchUserDetails(req: Request, res: Response, next: NextFunction) {
    try {
      // const { page, limit, search, role, sortBy, sortOrder } = req.query;

      const result = await this._fetchUserDetails.execute(req.query);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: SuccessMessage.DATA_FETCHED,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async blockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await this._blockUserUsecase.execute(id);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: SuccessMessage.BLOCKED_MSG,
      });
    } catch (error) {
      next(error);
    }
  }

  async unblockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await this._unblockUserUsecase.execute(id);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: SuccessMessage.UNBLOCK_MSG,
      });
    } catch (error) {
      next(error);
    }
  }
}
