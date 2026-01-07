import { ISignatureUploadUseCase } from "@application/use_cases/interfaces/user/signature-upload-usecase.interface";
import { SuccessMessage } from "@domain/enum/express/messages/success.message";
import { HttpStatus } from "@domain/enum/express/status-code";
import { FEATURE_TYPES } from "@infrastructure/inversify_di/types/feature/feature.type";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class FileUploadController {
    constructor(
        @inject(FEATURE_TYPES.SignatureUploadUseCase) private readonly _signatureUploadUseCase: ISignatureUploadUseCase,
    ) { }

    async signUpload(req: Request, res: Response, next: NextFunction) {
        try {
            const folder = req.query.folder as string;
            const userId = req.query.userId as string;
            const result = await this._signatureUploadUseCase.execute({
                folder: folder as string,
                userId: userId as string,
            });

            console.log('Result: ', result);
            return ResponseHelper.success(
                res,
                SuccessMessage.UPLOAD_SUCCESS,
                result,
                HttpStatus.OK,
            );
        } catch (error) {
            next(error);
        }
    }
}