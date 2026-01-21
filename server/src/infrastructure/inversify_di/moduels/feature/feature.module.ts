import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { IMfCagrRepository } from "@application/interfaces/repositories/feature/mf-cagr-repository.interface";
import { IMutualFundNavRepository } from "@application/interfaces/repositories/feature/mutual-fund-nav-repository.interface";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";
import { ISipRepository } from "@application/interfaces/repositories/feature/sip-repository.interface";
import { IHttpClient } from "@application/interfaces/services/externals/http-client-interface";
import { IMutualFundNavUpdateProvider } from "@application/interfaces/services/externals/mutual-fund-nav-update-provider.interface";
import { IStorageProvider } from "@application/interfaces/services/externals/storage-provider.interface";
import { SignatureUploadUseCase } from "@application/use_cases/file-upload/signature-upload.usecase";
import { IChangeFundStatusUseCase } from "@application/use_cases/interfaces/features/mutual-funds/change-fund-status-usecase.interface";
import { IFetchAllFundsUseCases } from "@application/use_cases/interfaces/features/mutual-funds/fetch-all-funds-usecase.interface";
import { IInvestmentUseCase } from "@application/use_cases/interfaces/features/mutual-funds/investment-usecase.interface";
import { IListFundsUserSideUseCase } from "@application/use_cases/interfaces/features/mutual-funds/list-fund-usecase.interface";
import { IMfCagrUseCase } from "@application/use_cases/interfaces/features/mutual-funds/mf-cagr-usecse.interface";
import { IMutualFundDetailsUseCase } from "@application/use_cases/interfaces/features/mutual-funds/mutual-fund-details-usecase.interface";
import { IMutualFundNavUpdatesUseCase } from "@application/use_cases/interfaces/features/mutual-funds/mutual-fund-nav-udpate-usecase.interface";
import { IMutualFundsUseCase } from "@application/use_cases/interfaces/features/mutual-funds/mutual-fund-usecase.interface";
import { INavAllocateUseCase } from "@application/use_cases/interfaces/features/mutual-funds/nav-allocate-usecase.interface";
import { INavHistoryUseCase } from "@application/use_cases/interfaces/features/mutual-funds/nav-history-usecase.interface";
import { ISipCreationUseCase } from "@application/use_cases/interfaces/features/sip/sip-creation-usecase.interface";
import { IConfirmRedeemUseCase } from "@application/use_cases/interfaces/features/portfolio/confirm-redeem-usecase.interface";
import { IPortfolioDetailsUseCase } from "@application/use_cases/interfaces/features/portfolio/portfolio-details-usecase.interface";
import { IRadeemInvestmentUseCase } from "@application/use_cases/interfaces/features/portfolio/redeem-investments-usecase.interface";
import { ISignatureUploadUseCase } from "@application/use_cases/interfaces/user/signature-upload-usecase.interface";
import { ChangeStatusUseCase } from "@application/use_cases/mutual-fund/change-status.usecase";
import { FetchAllFundUseCases } from "@application/use_cases/mutual-fund/fetch-all-funds.usecase";
import { InvestmentUseCase } from "@application/use_cases/mutual-fund/investment.usecase";
import { MfCagrUseCase } from "@application/use_cases/mutual-fund/mf-cagr-usecase";
import { MutualFundNavUpdate } from "@application/use_cases/mutual-fund/mutual-fund-nav-update.usecase";
import { MutualFundsUseCase } from "@application/use_cases/mutual-fund/mutual-fund.usecase";
import { NavAllocateUseCase } from "@application/use_cases/mutual-fund/nav-allocatation-usecase";
import { NavHistoryUseCase } from "@application/use_cases/mutual-fund/nav-chart-usecase";
import { SipCreationUseCase } from "@application/use_cases/sip/sip-creation-usecase";
import { ConfirmRedeemUseCase } from "@application/use_cases/portfolio/confirm-redeem-usecase";
import { PortfolioDetailsUseCase } from "@application/use_cases/portfolio/portfolio-details.usecase";
import { RadeemInvestmentUseCase } from "@application/use_cases/portfolio/radeem-investments-usecase";
import { ListFundUserSideUseCase } from "@application/use_cases/user/mutual-fund/list-funds.usecase";
import { MutualFundDetailsUseCase } from "@application/use_cases/user/mutual-fund/mutual-fund-details.usecase";
import { MfCagrRepository } from "@infrastructure/databases/repository/mutual-fund/cagr-repository";
import { InvestmentRepository } from "@infrastructure/databases/repository/mutual-fund/investment.repository";
import { MutualFundNavRepsitory } from "@infrastructure/databases/repository/mutual-fund/mutual-fund-nav.repository";
import { MutualFundRepository } from "@infrastructure/databases/repository/mutual-fund/mutual-fund.repostiory";
import { SipRepository } from "@infrastructure/databases/repository/mutual-fund/sip.repository";
import { FEATURE_TYPES } from "@infrastructure/inversify_di/types/feature/feature.type";
import { AxiosHttpClient } from "@infrastructure/providers/axios/http.client";
import { NavUpdateProvider } from "@infrastructure/providers/mutual-fund/nav-update.provider";
import { CloudinaryStorageProvider } from "@infrastructure/providers/storage-providers/cloudinary.provider";
import { MutualFundsAdminController } from "@presentation/http/controllers/mutual-funds/mutual-fund-admin.controller";
import { MutualFundSipController } from "@presentation/http/controllers/mutual-funds/mutual-fund-sip.controller";
import { MutualFundUserController } from "@presentation/http/controllers/mutual-funds/mutual-fund-user.controller";
import { PortFolioController } from "@presentation/http/controllers/portfolio/portfolio.controller";
import { ContainerModule } from "inversify";
import { IExecuteDueSipsUseCase } from "@application/use_cases/interfaces/features/sip/execute-due-sip-usecase.interface";
import { ExecuteDueSipUseCase } from "@application/use_cases/sip/execute-due-sip.usecase";
import { ISipInstallmentRepository } from "@application/interfaces/repositories/feature/sip-intallment-repository.interface";
import { SipInstallmentRepository } from "@infrastructure/databases/repository/mutual-fund/sip-intallment.repository";
import { ISystemVerifyTransactionUseCase } from "@application/use_cases/interfaces/admin/system-verify-transaction.interface";
import { SystemVerifyTransactionUseCase } from "@application/use_cases/admin/transactions-management/system-verify.transaction";
import { InternalTransactionVerificationService } from "@infrastructure/providers/wallet-integrity/internal-transaction-verification.service";
import { ISipDetailsUseCase } from "@application/use_cases/interfaces/features/sip/sip-details-usecase.interface";
import { SipDetailsUseCase } from "@application/use_cases/sip/sip-details.usecase";

export const FeatureModule = new ContainerModule(({ bind }) => {
    //Repositories
    bind<IMutualFundRepository>(FEATURE_TYPES.MutualFundRepository).to(MutualFundRepository);
    bind<IMutualFundNavRepository>(FEATURE_TYPES.MutualFundNavRepository).to(MutualFundNavRepsitory);
    bind<IMfCagrRepository>(FEATURE_TYPES.MfCagrRepository).to(MfCagrRepository);
    bind<IInvestmentRepository>(FEATURE_TYPES.InvestmentRepository).to(InvestmentRepository);
    bind<ISipRepository>(FEATURE_TYPES.SipRepository).to(SipRepository);
    bind<ISipInstallmentRepository>(FEATURE_TYPES.SipInstallmentRepository).to(SipInstallmentRepository);

    //UseCases
    bind<IMutualFundsUseCase>(FEATURE_TYPES.MutualFundUsecase).to(MutualFundsUseCase);
    bind<ISignatureUploadUseCase>(FEATURE_TYPES.SignatureUploadUseCase).to(SignatureUploadUseCase);
    bind<IFetchAllFundsUseCases>(FEATURE_TYPES.FetchAllFundUseCases).to(FetchAllFundUseCases);
    bind<IMutualFundNavUpdatesUseCase>(FEATURE_TYPES.MutualFundNavUpdateUseCase).to(MutualFundNavUpdate);
    bind<IChangeFundStatusUseCase>(FEATURE_TYPES.ChangeStatusUseCase).to(ChangeStatusUseCase);
    bind<IListFundsUserSideUseCase>(FEATURE_TYPES.ListFundUserSideUseCase).to(ListFundUserSideUseCase);
    bind<IMfCagrUseCase>(FEATURE_TYPES.MfCagrUseCase).to(MfCagrUseCase);
    bind<IMutualFundDetailsUseCase>(FEATURE_TYPES.MutualFundDetailsUseCase).to(MutualFundDetailsUseCase);
    bind<INavHistoryUseCase>(FEATURE_TYPES.NavHistoryUseCase).to(NavHistoryUseCase);
    bind<IInvestmentUseCase>(FEATURE_TYPES.InvestmentUseCase).to(InvestmentUseCase);
    bind<INavAllocateUseCase>(FEATURE_TYPES.NavAllocateUseCase).to(NavAllocateUseCase);
    bind<IPortfolioDetailsUseCase>(FEATURE_TYPES.PortfolioDetailsUseCase).to(PortfolioDetailsUseCase);
    bind<IRadeemInvestmentUseCase>(FEATURE_TYPES.RadeemInvestmentUseCase).to(RadeemInvestmentUseCase);
    bind<IConfirmRedeemUseCase>(FEATURE_TYPES.ConfirmRedeemUseCase).to(ConfirmRedeemUseCase);
    bind<ISipCreationUseCase>(FEATURE_TYPES.SipCreationUseCase).to(SipCreationUseCase);
    bind<IExecuteDueSipsUseCase>(FEATURE_TYPES.ExecuteDueSipUseCase).to(ExecuteDueSipUseCase);
    bind<ISystemVerifyTransactionUseCase>(FEATURE_TYPES.SystemVerifyTransactionUseCase).to(SystemVerifyTransactionUseCase);
    bind<ISipDetailsUseCase>(FEATURE_TYPES.SipDetailsUseCase).to(SipDetailsUseCase);


    //Providers
    bind<IHttpClient>(FEATURE_TYPES.HttpClient).to(AxiosHttpClient);
    bind<IStorageProvider>(FEATURE_TYPES.CloudinaryStorageProvider).to(CloudinaryStorageProvider);
    bind<IMutualFundNavUpdateProvider>(FEATURE_TYPES.NavUpdateProvider).to(NavUpdateProvider);
    bind<InternalTransactionVerificationService>(FEATURE_TYPES.InternalTransactionVerificationService).to(InternalTransactionVerificationService);

    //Controllers
    bind<MutualFundsAdminController>(FEATURE_TYPES.MutualFundsAdminController).to(MutualFundsAdminController);
    bind<MutualFundUserController>(FEATURE_TYPES.MutualFundsUserController).to(MutualFundUserController);
    bind<PortFolioController>(FEATURE_TYPES.PortFolioController).to(PortFolioController);
    bind<MutualFundSipController>(FEATURE_TYPES.MutualFundSipController).to(MutualFundSipController);
});
