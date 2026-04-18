import { ContainerModule } from "inversify";
import { ALGO_TRADING_TYPES } from "./algo-trading.type";
import { AdminAlgoTradingUseCase } from "@application/use_cases/admin/algo-trading/admin-algo-trading.usecase";
import { IAdminAlgoTradingUseCase } from "@application/use_cases/admin/algo-trading/interfaces/admin-algo-trading-usecaes.interface";
import { AdminGetStrategiesUseCase } from "@application/use_cases/admin/algo-trading/admin-get-strategies.usecaese";
import { AdminAlgoTradingController } from "@presentation/http/controllers/admin/admin-algo-trading.controller";
import { AdminGetSignalUseCase } from "@application/use_cases/admin/algo-trading/admin-get-signal.usecase";
import { IAdminGetSignalUseCase } from "@application/use_cases/admin/algo-trading/interfaces/admin-get-signals-usecase.interface";
import { IAdminGetStrategiesUseCase } from "@application/use_cases/admin/algo-trading/interfaces/admin-get-strategies-usecase.interface";
import { AdminGetAlgoTradesUseCase } from "@application/use_cases/admin/algo-trading/admin-get-algo-trades.usecase";
import { IAdminGetAlgoTradesUseCase } from "@application/use_cases/admin/algo-trading/interfaces/admin-get-algo-trades-usecase.interface";

export const AlogTradingModule = new ContainerModule(({ bind }) => {

    bind<IAdminAlgoTradingUseCase>(ALGO_TRADING_TYPES.AdminAlgoTradingUseCase).to(AdminAlgoTradingUseCase);
    bind<IAdminGetStrategiesUseCase>(ALGO_TRADING_TYPES.AdminGetStrategiesUseCase).to(AdminGetStrategiesUseCase);
    bind<IAdminGetSignalUseCase>(ALGO_TRADING_TYPES.AdminGetSignalUseCase).to(AdminGetSignalUseCase);
    bind<IAdminGetAlgoTradesUseCase>(ALGO_TRADING_TYPES.AdminGetAlgoTradesUseCase).to(AdminGetAlgoTradesUseCase);
    bind<AdminAlgoTradingController>(ALGO_TRADING_TYPES.AdminAlgoTradingController).to(AdminAlgoTradingController);

})