import { container } from '@infrastructure/inversify_di/inversify.di';
import { Routes } from '@presentation/express/utils/constants/feature-routes.constants';
import { FileUploadController } from '@presentation/http/controllers/file-upload/file-upload.controller';
import { Router } from 'express';

const router = Router();

const fileUploadController = container.get<FileUploadController>(FileUploadController)

router.get(Routes.FILE_SIGNINATURE, fileUploadController.signUpload.bind(fileUploadController));

export default router