import { ContainerModule } from "inversify";
import { MUTUAL_FUND_TYPES } from "./mutual-fund.types";

// Repositories
import { MutualFundRepository } from "@infrastructure/databases/repository/mutual-fund/mutual-fund.repostiory";
import { MutualFundNavRepsitory } from "@infrastructure/databases/repository/mutual-fund/mutual-fund-nav.repository";
import { MfCagrRepository } from "@infrastructure/databases/repository/mutual-fund/cagr-repository";
import { InvestmentRepository } from "@infrastructure/databases/repository/mutual-fund/investment.repository";

// UseCases
import { MutualFundsUseCase } from "@application/use_cases/mutual-fund/mutual-fund.usecase";
import { FetchAllFundUseCases } from "@application/use_cases/mutual-fund/fetch-all-funds.usecase";
import { MutualFundNavUpdate } from "@application/use_cases/mutual-fund/mutual-fund-nav-update.usecase";
import { ChangeStatusUseCase } from "@application/use_cases/mutual-fund/change-status.usecase";
import { ListFundUserSideUseCase } from "@application/use_cases/mutual-fund/list-funds.usecase";
import { MfCagrUseCase } from "@application/use_cases/mutual-fund/mf-cagr-usecase";
import { MutualFundDetailsUseCase } from "@application/use_cases/mutual-fund/mutual-fund-details.usecase";
import { OneTimeInvestmentUseCase } from "@application/use_cases/mutual-fund/one-time-investment.usecase";
import { NavAllocateUseCase } from "@application/use_cases/mutual-fund/nav-allocatation-usecase";
import { MfInvestmentHistoryUseCase } from "@application/use_cases/mutual-fund/mf-investment-history.usecase";

// Providers
import { NavUpdateProvider } from "@infrastructure/providers/mutual-fund/nav-update.provider";
import { InvestmentValidationService } from "@application/services/mutual-fund/investment-validation.service";


// Controllers
import { MutualFundsAdminController } from "@presentation/http/controllers/mutual-funds/mutual-fund-admin.controller";
import { MutualFundUserController } from "@presentation/http/controllers/mutual-funds/mutual-fund-user.controller";

// Schedulers
import { NavDailyScheduler } from "@infrastructure/providers/cron-scheduler/mutual-fund/nav-cron.scheduler";
import { CagrUpdateScheduler } from "@infrastructure/providers/cron-scheduler/mutual-fund/cagr-cron-scheduler";
import { NavAllocationScheduler } from "@infrastructure/providers/cron-scheduler/mutual-fund/nav-allocatation-scheduler";

// Interfaces
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";
import { IMutualFundNavRepository } from "@application/interfaces/repositories/feature/mutual-fund-nav-repository.interface";
import { IMfCagrRepository } from "@application/interfaces/repositories/feature/mf-cagr-repository.interface";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { IMutualFundsUseCase } from "@application/use_cases/mutual-fund/interfaces/mutual-fund-usecase.interface";
import { IFetchAllFundsUseCases } from "@application/use_cases/mutual-fund/interfaces/fetch-all-funds-usecase.interface";
import { IMutualFundNavUpdatesUseCase } from "@application/use_cases/mutual-fund/interfaces/mutual-fund-nav-udpate-usecase.interface";
import { IChangeFundStatusUseCase } from "@application/use_cases/mutual-fund/interfaces/change-fund-status-usecase.interface";
import { IListFundsUserSideUseCase } from "@application/use_cases/mutual-fund/interfaces/list-fund-usecase.interface";
import { IMfCagrUseCase } from "@application/use_cases/mutual-fund/interfaces/mf-cagr-usecse.interface";
import { IMutualFundDetailsUseCase } from "@application/use_cases/mutual-fund/interfaces/mutual-fund-details-usecase.interface";
import { IOneTimeInvestmentUseCase } from "@application/use_cases/mutual-fund/interfaces/one-time-investment.usecase.interface";
import { INavAllocateUseCase } from "@application/use_cases/mutual-fund/interfaces/nav-allocate-usecase.interface";
import { IMfInvestmentHistoryUseCase } from "@application/use_cases/mutual-fund/interfaces/mf-investment-history-usecase.interface";
import { IMutualFundNavUpdateProvider } from "@application/interfaces/services/externals/mutual-fund-nav-update-provider.interface";
import { IInvestmentValidationService } from "@application/services/mutual-fund/interfaces/investment-validation.service.interface";



export const MutualFundModule = new ContainerModule(({ bind }) => {
    // Repositories
    bind<IMutualFundRepository>(MUTUAL_FUND_TYPES.MutualFundRepository).to(MutualFundRepository);
    bind<IMutualFundNavRepository>(MUTUAL_FUND_TYPES.MutualFundNavRepository).to(MutualFundNavRepsitory);
    bind<IMfCagrRepository>(MUTUAL_FUND_TYPES.MfCagrRepository).to(MfCagrRepository);
    bind<IInvestmentRepository>(MUTUAL_FUND_TYPES.InvestmentRepository).to(InvestmentRepository);

    // UseCases
    bind<IMutualFundsUseCase>(MUTUAL_FUND_TYPES.MutualFundUsecase).to(MutualFundsUseCase);
    bind<IFetchAllFundsUseCases>(MUTUAL_FUND_TYPES.FetchAllFundUseCases).to(FetchAllFundUseCases);
    bind<IMutualFundNavUpdatesUseCase>(MUTUAL_FUND_TYPES.MutualFundNavUpdateUseCase).to(MutualFundNavUpdate);
    bind<IChangeFundStatusUseCase>(MUTUAL_FUND_TYPES.ChangeStatusUseCase).to(ChangeStatusUseCase);
    bind<IListFundsUserSideUseCase>(MUTUAL_FUND_TYPES.ListFundUserSideUseCase).to(ListFundUserSideUseCase);
    bind<IMfCagrUseCase>(MUTUAL_FUND_TYPES.MfCagrUseCase).to(MfCagrUseCase);
    bind<IMutualFundDetailsUseCase>(MUTUAL_FUND_TYPES.MutualFundDetailsUseCase).to(MutualFundDetailsUseCase);
    bind<IOneTimeInvestmentUseCase>(MUTUAL_FUND_TYPES.InvestmentUseCase).to(OneTimeInvestmentUseCase);
    bind<INavAllocateUseCase>(MUTUAL_FUND_TYPES.NavAllocateUseCase).to(NavAllocateUseCase);
    bind<IMfInvestmentHistoryUseCase>(MUTUAL_FUND_TYPES.MfInvestmentHistoryUseCase).to(MfInvestmentHistoryUseCase);

    // Providers
    bind<IMutualFundNavUpdateProvider>(MUTUAL_FUND_TYPES.NavUpdateProvider).to(NavUpdateProvider);
    bind<IInvestmentValidationService>(MUTUAL_FUND_TYPES.InvestmentValidationService).to(InvestmentValidationService);


    // Controllers
    bind<MutualFundsAdminController>(MUTUAL_FUND_TYPES.MutualFundsAdminController).to(MutualFundsAdminController);
    bind<MutualFundUserController>(MUTUAL_FUND_TYPES.MutualFundsUserController).to(MutualFundUserController);

    // Schedulers
    bind<NavDailyScheduler>(MUTUAL_FUND_TYPES.NavDailyScheduler).to(NavDailyScheduler).inSingletonScope();
    bind<CagrUpdateScheduler>(MUTUAL_FUND_TYPES.CagrUpdateScheduler).to(CagrUpdateScheduler).inSingletonScope();
    bind<NavAllocationScheduler>(MUTUAL_FUND_TYPES.NavAllocationScheduler).to(NavAllocationScheduler).inSingletonScope();
});
