import { SipCreationDTO } from '@application/dto/sip/sip-creation.dto';
import { container } from '@infrastructure/inversify_di/container';
import { validateDTO } from '@presentation/express/middlewares/validation-dto.middlewares';
import { MutualFundSipController } from '@presentation/http/controllers/mutual-funds/mutual-fund-sip.controller';
import { Router } from 'express';

const router = Router();

const sipController = container.get<MutualFundSipController>(MutualFundSipController);

router.post("/create", validateDTO(SipCreationDTO), sipController.createSip.bind(sipController));
router.get('/', sipController.listSips.bind(sipController));
router.patch('/pause/:sipId', sipController.pause.bind(sipController));
router.patch('/resume/:sipId', sipController.resume.bind(sipController));
router.patch('/cancel/:sipId', sipController.cancel.bind(sipController));

export default router;