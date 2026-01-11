import { IMfCagrRepository } from "@application/interfaces/repositories/feature/mf-cagr-repository.interface";
import { IMutualFundNavRepository } from "@application/interfaces/repositories/feature/mutual-fund-nav-repository.interface";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";
import { IHttpClient } from "@application/interfaces/services/externals/http-client-interface";
import { IMutualFundNavUpdateProvider } from "@application/interfaces/services/externals/mutual-fund-nav-update-provider.interface";
import { IStorageProvider } from "@application/interfaces/services/externals/storage-provider.interface";
import { SignatureUploadUseCase } from "@application/use_cases/file-upload/signature-upload.usecase";
import { IChangeFundStatusUseCase } from "@application/use_cases/interfaces/features/mutual-funds/change-fund-status-usecase.interface";
import { IFetchAllFundsUseCases } from "@application/use_cases/interfaces/features/mutual-funds/fetch-all-funds-usecase.interface";
import { IListFundsUserSideUseCase } from "@application/use_cases/interfaces/features/mutual-funds/list-fund-usecase.interface";
import { IMfCagrUseCase } from "@application/use_cases/interfaces/features/mutual-funds/mf-cagr-usecse.interface";
import { IMutualFundDetailsUseCase } from "@application/use_cases/interfaces/features/mutual-funds/mutual-fund-details-usecase.interface";
import { IMutualFundNavUpdatesUseCase } from "@application/use_cases/interfaces/features/mutual-funds/mutual-fund-nav-udpate-usecase.interface";
import { IMutualFundsUseCase } from "@application/use_cases/interfaces/features/mutual-funds/mutual-fund-usecase.interface";
import { INavHistoryUseCase } from "@application/use_cases/interfaces/features/mutual-funds/nav-history-usecase.interface";
import { ISignatureUploadUseCase } from "@application/use_cases/interfaces/user/signature-upload-usecase.interface";
import { ChangeStatusUseCase } from "@application/use_cases/mutual-fund/change-status.usecase";
import { FetchAllFundUseCases } from "@application/use_cases/mutual-fund/fetch-all-funds.usecase";
import { MfCagrUseCase } from "@application/use_cases/mutual-fund/mf-cagr-usecase";
import { MutualFundNavUpdate } from "@application/use_cases/mutual-fund/mutual-fund-nav-update.usecase";
import { MutualFundsUseCase } from "@application/use_cases/mutual-fund/mutual-fund.usecase";
import { NavHistoryUseCase } from "@application/use_cases/mutual-fund/nav-chart-usecase";
import { ListFundUserSideUseCase } from "@application/use_cases/user/mutual-fund/list-funds.usecase";
import { MutualFundDetailsUseCase } from "@application/use_cases/user/mutual-fund/mutual-fund-details.usecase";
import { MfCagrRepository } from "@infrastructure/databases/repository/mutual-fund/cagr-repository";
import { MutualFundNavRepsitory } from "@infrastructure/databases/repository/mutual-fund/mutual-fund-nav.repository";
import { MutualFundRepository } from "@infrastructure/databases/repository/mutual-fund/mutual-fund.repostiory";
import { FEATURE_TYPES } from "@infrastructure/inversify_di/types/feature/feature.type";
import { AxiosHttpClient } from "@infrastructure/providers/axios/http.client";
import { NavUpdateProvider } from "@infrastructure/providers/mutual-fund/nav-update.provider";
import { CloudinaryStorageProvider } from "@infrastructure/providers/storage-providers/cloudinary.provider";
import { MutualFundsAdminController } from "@presentation/http/controllers/mutual-funds/mutual-fund-admin.controller";
import { MutualFundUserController } from "@presentation/http/controllers/mutual-funds/mutual-fund-user.controller";
import { ContainerModule } from "inversify";

export const FeatureModule = new ContainerModule(({ bind }) => {
    //Repositories
    bind<IMutualFundRepository>(FEATURE_TYPES.MutualFundRepository).to(MutualFundRepository);
    bind<IMutualFundNavRepository>(FEATURE_TYPES.MutualFundNavRepository).to(MutualFundNavRepsitory);
    bind<IMfCagrRepository>(FEATURE_TYPES.MfCagrRepository).to(MfCagrRepository);

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

    //Providers
    bind<IHttpClient>(FEATURE_TYPES.HttpClient).to(AxiosHttpClient);
    bind<IStorageProvider>(FEATURE_TYPES.CloudinaryStorageProvider).to(CloudinaryStorageProvider);
    bind<IMutualFundNavUpdateProvider>(FEATURE_TYPES.NavUpdateProvider).to(NavUpdateProvider);

    //Controllers
    bind<MutualFundsAdminController>(FEATURE_TYPES.MutualFundsAdminController).to(MutualFundsAdminController);
    bind<MutualFundUserController>(FEATURE_TYPES.MutualFundsUserController).to(MutualFundUserController);
});
