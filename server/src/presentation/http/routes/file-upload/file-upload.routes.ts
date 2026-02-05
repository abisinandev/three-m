import { container } from '@infrastructure/inversify_di/container';
import { CommonRoutes } from '@shared/routes/common.routes';
import { FileUploadController } from '@presentation/http/controllers/file-upload/file-upload.controller';
import { Router } from 'express';

const router = Router();

const fileUploadController = container.get<FileUploadController>(FileUploadController)

router.get(CommonRoutes.FILE_SIGNATURE, fileUploadController.signUpload.bind(fileUploadController));

export default router