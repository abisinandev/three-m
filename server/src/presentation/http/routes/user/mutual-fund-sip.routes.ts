import { SipCreationDTO } from '@application/dto/sip/sip-creation.dto';
import { container } from '@infrastructure/inversify_di/container';
import { validateDTO } from '@presentation/express/middlewares/validation-dto.middlewares';
import { MutualFundSipController } from '@presentation/http/controllers/mutual-funds/mutual-fund-sip.controller';
import { Router } from 'express';
import { UserSipRoutes } from '@shared/routes/user.routes';
const router = Router();

const sipController = container.get<MutualFundSipController>(MutualFundSipController);

router.post(UserSipRoutes.CREATE, validateDTO(SipCreationDTO), sipController.createSip.bind(sipController));
router.get(UserSipRoutes.LIST, sipController.listSips.bind(sipController));
router.patch(UserSipRoutes.PAUSE, sipController.pause.bind(sipController));
router.patch(UserSipRoutes.RESUME, sipController.resume.bind(sipController));
router.patch(UserSipRoutes.CANCEL, sipController.cancel.bind(sipController));

export default router;