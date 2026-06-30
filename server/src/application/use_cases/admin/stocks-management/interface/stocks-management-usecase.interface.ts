import { StockResponseDtos } from "@application/dto/admin/stocks/stocks-management.dto";

export interface StockQueryParams {
    page?: number | string;
    limit?: number | string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    exchange?: string;
    isTradable?: boolean | string;
    isTracked?: boolean | string;
    isVisible?: boolean | string;
}

export interface StockPaginatedResponse {
    data: StockResponseDtos[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface IStockManagementUseCase {
    execute(query: StockQueryParams): Promise<StockPaginatedResponse>;
}
