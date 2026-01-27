import { ContainerModule } from "inversify";
import { SIP_TYPES } from "./sip.types";

// Repositories
import { SipRepository } from "@infrastructure/databases/repository/mutual-fund/sip.repository";
import { SipInstallmentRepository } from "@infrastructure/databases/repository/mutual-fund/sip-intallment.repository";

// UseCases
import { SipCreationUseCase } from "@application/use_cases/sip/sip-creation-usecase";
import { ExecuteDueSipUseCase } from "@application/use_cases/sip/execute-due-sip.usecase";
import { SipDetailsUseCase } from "@application/use_cases/admin/sip-management/sip-details.usecase";
import { UserSipDetailsUseCase } from "@application/use_cases/sip/user-sip-details.usecase";
import { PauseSipUseCase } from "@application/use_cases/sip/pause-sip-usecase";
import { CancelSipUseCase } from "@application/use_cases/sip/cancel-sip-usecase";
import { ResumeSipUseCase } from "@application/use_cases/sip/resume-sip-usecase";

// Controllers
import { MutualFundSipController } from "@presentation/http/controllers/mutual-funds/mutual-fund-sip.controller";

// Interfaces
import { ISipRepository } from "@application/interfaces/repositories/feature/sip-repository.interface";
import { ISipInstallmentRepository } from "@application/interfaces/repositories/feature/sip-intallment-repository.interface";
import { ISipCreationUseCase } from "@application/use_cases/sip/interfaces/sip-creation-usecase.interface";
import { IExecuteDueSipsUseCase } from "@application/use_cases/sip/interfaces/execute-due-sip-usecase.interface";
import { ISipDetailsUseCase } from "@application/use_cases/admin/sip-management/interfaces/sip-details-usecase.interface";
import { IUserSipDetailsUseCase } from "@application/use_cases/sip/interfaces/user-sip-details-usecase.interface";
import { IPauseSipUseCase } from "@application/use_cases/sip/interfaces/pause-sip-usecase.interface";
import { ICancelSipUseCase } from "@application/use_cases/sip/interfaces/cancel-sip-usecase.interface";
import { IResumeSipUseCase } from "@application/use_cases/sip/interfaces/resume-sip-usecase.interface";


export const SipModule = new ContainerModule(({ bind }) => {
    // Repositories
    bind<ISipRepository>(SIP_TYPES.SipRepository).to(SipRepository);
    bind<ISipInstallmentRepository>(SIP_TYPES.SipInstallmentRepository).to(SipInstallmentRepository);

    // UseCases
    bind<ISipCreationUseCase>(SIP_TYPES.SipCreationUseCase).to(SipCreationUseCase);
    bind<IExecuteDueSipsUseCase>(SIP_TYPES.ExecuteDueSipUseCase).to(ExecuteDueSipUseCase);
    bind<ISipDetailsUseCase>(SIP_TYPES.SipDetailsUseCase).to(SipDetailsUseCase);
    bind<IUserSipDetailsUseCase>(SIP_TYPES.UserSipDetailsUseCase).to(UserSipDetailsUseCase);
    bind<IPauseSipUseCase>(SIP_TYPES.PauseSipUseCase).to(PauseSipUseCase);
    bind<ICancelSipUseCase>(SIP_TYPES.CancelSipUseCase).to(CancelSipUseCase);
    bind<IResumeSipUseCase>(SIP_TYPES.ResumeSipUseCase).to(ResumeSipUseCase);

    // Controllers
    bind<MutualFundSipController>(SIP_TYPES.MutualFundSipController).to(MutualFundSipController);
});
