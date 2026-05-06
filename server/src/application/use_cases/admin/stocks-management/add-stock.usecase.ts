import { inject, injectable } from "inversify";
import { IAddStockUseCase } from "./interface/add-stock.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { ISearchedStock } from "@application/interfaces/repositories/stock/stock-search-provider.interface";
import { StockEntity } from "@domain/entities/stock/stock.entity";
import { HttpStatus } from "@domain/enum/express/status-code";
import AppError from "@presentation/express/utils/error-handling/app.error";

@injectable()
export class AddStockUseCase implements IAddStockUseCase {
    constructor(
        @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
    ) { }

    async execute(stock: ISearchedStock & { logo?: string | null }): Promise<void> {
        // Append suffix based on exchange if not already present
        let symbolWithSuffix = stock.symbol.toUpperCase();
        const suffix = stock.exchange === "NSE" ? ".NS" : stock.exchange === "BSE" ? ".BS" : "";
        
        if (suffix && !symbolWithSuffix.endsWith(suffix)) {
            symbolWithSuffix = `${symbolWithSuffix}${suffix}`;
        }

        // Check for duplicate with suffixed symbol
        const existing = await this._stockRepository.findBySymbol(symbolWithSuffix);
        if (existing) {
            throw new AppError(`Stock with symbol ${symbolWithSuffix} already exists in the system`, HttpStatus.CONFLICT);
        }

        const stockEntity = StockEntity.create({
            name: stock.name,
            symbol: symbolWithSuffix,
            exchange: stock.exchange,
            isTradable: false,
            isVisible: false,
            sector: "Unknown",
            logo: stock.logo || null
        });

        await this._stockRepository.saveMany([stockEntity]);
    }
}
