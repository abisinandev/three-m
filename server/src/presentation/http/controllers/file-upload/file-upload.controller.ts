import { ISignatureUploadUseCase } from "@application/use_cases/auth/interfaces/signature-upload-usecase.interface";
import { HttpStatus } from "@domain/enum/express/status-code";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { EXTERNAL_TYPES } from "@infrastructure/inversify_di/features/external/external.types";
import { SuccessMessages } from "@shared/constants/success.messages";

@injectable()
export class FileUploadController {
    constructor(
        @inject(EXTERNAL_TYPES.SignatureUploadUseCase) private readonly _signatureUploadUseCase: ISignatureUploadUseCase,
    ) { }

    async signUpload(req: Request, res: Response, next: NextFunction) {
        try {
            const folder = req.query.folder as string;
            
            const result = await this._signatureUploadUseCase.execute({
                folder: folder as string,
            });

            console.log('file upload: ', result);
            return ResponseHelper.success(
                res,
                SuccessMessages.DATA.UPLOAD_SUCCESS,
                result,
                HttpStatus.OK,
            );
        } catch (error) {
            next(error);
        }
    }
}