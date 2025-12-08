import type { IFetchAllKycDocsUseCase } from "@application/use_cases/interfaces/admin/kyc-management-usecase.interface";
import type { IRejectKycUseCase } from "@application/use_cases/interfaces/admin/reject-kyc-usecase.interface";
import type { IVerifyKycUseCase } from "@application/use_cases/interfaces/admin/verify-kyc-usecase.interface";
import type { IViewKycDetailsUseCase } from "@application/use_cases/interfaces/admin/view-kyc-details-usecase.interface";
import { SuccessMessage } from "@domain/enum/express/messages/success.message";
import { HttpStatus } from "@domain/enum/express/status-code";
import { ADMIN_TYPES } from "@infrastructure/inversify_di/types/admin/admin.types";
import  { type NextFunction, type Request, type Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class AdminKycController {
  constructor(
    @inject(ADMIN_TYPES.FetchAllKycDocsUseCase) private readonly _fetchAllKycDocs: IFetchAllKycDocsUseCase,
    @inject(ADMIN_TYPES.ViewKycDetailsUseCase) private readonly _viewKycDetails: IViewKycDetailsUseCase,
    @inject(ADMIN_TYPES.VerifyKycUseCase) private readonly _verifyKycUseCase: IVerifyKycUseCase,
    @inject(ADMIN_TYPES.RejectKycUseCase) private readonly _rejectKycUseCase: IRejectKycUseCase,
  ) {}

  async fetchAllKycDocs(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this._fetchAllKycDocs.execute(req.query);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: SuccessMessage.DATA_FETCHED,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async viewKycDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { kycId } = req.params;
      // cons
      const result = await this._viewKycDetails.execute(kycId);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: SuccessMessage.DATA_FETCHED,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async rejectKyc(req: Request, res: Response, next: NextFunction) {
    try {
      const { kycId } = req.params;
      const data = { ...req.body };
      console.log(data.reason, "Reason");
      await this._rejectKycUseCase.execute({
        kycId,
        reason: data.reason,
      });
      return res.status(HttpStatus.OK).json({
        success: true,
        message: SuccessMessage.REJECT_KYC,
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyKyc(req: Request, res: Response, next: NextFunction) {
    try {
      const { kycId } = req.params;
      await this._verifyKycUseCase.execute(kycId);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: SuccessMessage.VERIFY_KYC,
      });
    } catch (error) {
      next(error);
    }
  }
}
