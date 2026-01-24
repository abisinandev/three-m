import type { IFetchAllKycDocsUseCase } from "@application/use_cases/admin/interfaces/kyc-management-usecase.interface";
import type { IRejectKycUseCase } from "@application/use_cases/admin/interfaces/reject-kyc-usecase.interface";
import type { IVerifyKycUseCase } from "@application/use_cases/admin/interfaces/verify-kyc-usecase.interface";
import type { IViewKycDetailsUseCase } from "@application/use_cases/admin/interfaces/view-kyc-details-usecase.interface";
import { SuccessMessage } from "@domain/enum/express/messages/success.message";
import { HttpStatus } from "@domain/enum/express/status-code";
import { ADMIN_TYPES } from "@infrastructure/inversify_di/types/admin/admin.types";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { type NextFunction, type Request, type Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class AdminKycController {
  constructor(
    @inject(ADMIN_TYPES.FetchAllKycDocsUseCase) private readonly _fetchAllKycDocs: IFetchAllKycDocsUseCase,
    @inject(ADMIN_TYPES.ViewKycDetailsUseCase) private readonly _viewKycDetails: IViewKycDetailsUseCase,
    @inject(ADMIN_TYPES.VerifyKycUseCase) private readonly _verifyKycUseCase: IVerifyKycUseCase,
    @inject(ADMIN_TYPES.RejectKycUseCase) private readonly _rejectKycUseCase: IRejectKycUseCase,
  ) { }

  async fetchAllKycDocs(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this._fetchAllKycDocs.execute(req.query);

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

  async viewKycDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { kycId } = req.params;
      const result = await this._viewKycDetails.execute(kycId);

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

  async rejectKyc(req: Request, res: Response, next: NextFunction) {
    try {
      const { kycId } = req.params;
      const data = { ...req.body };

      await this._rejectKycUseCase.execute({
        kycId,
        reason: data.reason,
      });

      return ResponseHelper.success(
        res,
        SuccessMessage.REJECT_KYC,
        HttpStatus.OK,
      );

    } catch (error) {
      next(error);
    }
  }

  async verifyKyc(req: Request, res: Response, next: NextFunction) {
    try {
      const { kycId } = req.params;
      await this._verifyKycUseCase.execute(kycId);

      return ResponseHelper.success(
        res,
        SuccessMessage.VERIFY_KYC,
        HttpStatus.OK,
      );

    } catch (error) {
      next(error);
    }
  }
}
