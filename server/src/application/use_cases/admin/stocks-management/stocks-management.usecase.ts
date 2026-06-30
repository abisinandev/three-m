import { inject, injectable } from "inversify";
import { IStockManagementUseCase, StockQueryParams, StockPaginatedResponse } from "./interface/stocks-management-usecase.interface";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { StockResponseDtos } from "@application/dto/admin/stocks/stocks-management.dto";

@injectable()
export class StockManagementUseCase implements IStockManagementUseCase {
    constructor(
        @inject(STOCK_TYPES.StockRepository) private stockRepository: IStockRepository
    ) { }

    async execute(query: StockQueryParams): Promise<StockPaginatedResponse> {
        const {
            page = 1,
            limit = 20,
            search = "",
            sortBy = "symbol",
            sortOrder = "asc",
            exchange,
            isTradable,
            isTracked,
            isVisible
        } = query;

        const filter: Record<string, unknown> = {};

        if (exchange) {
            filter.exchange = exchange;
        }

        if (isTradable !== undefined && isTradable !== "") {
            filter.isTradable = isTradable === "true" || isTradable === true;
        }

        if (isTracked !== undefined && isTracked !== "") {
            filter.isTracked = isTracked === "true" || isTracked === true;
        }

        if (isVisible !== undefined && isVisible !== "") {
            filter.isVisible = isVisible === "true" || isVisible === true;
        }

        const parsedPage = Number(page);
        const parsedLimit = Number(limit);

        const result = await this.stockRepository.findWithFiltersAdmin({
            page: parsedPage,
            limit: parsedLimit,
            search: String(search),
            sortBy: String(sortBy),
            sortOrder: String(sortOrder),
            filter
        });

        const data: StockResponseDtos[] = result.data.map(item => ({
            symbol: item.symbol,
            exchange: item.exchange,
            name: item.name,
            sector: item.sector,
            logo: item.logo,
            isTradable: item.isTradable,
            isVisible: item.isVisible,
            createdAt: item.createdAt,
        }));

        return {
            data,
            total: result.total,
            page: parsedPage,
            limit: parsedLimit,
            totalPages: Math.ceil(result.total / parsedLimit)
        };
    }
}