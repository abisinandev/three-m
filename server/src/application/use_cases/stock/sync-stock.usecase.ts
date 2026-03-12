import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IStockApiClient } from "@application/interfaces/repositories/stock/stocks-api.interface";
import { inject, injectable } from "inversify";
import { StockEntity } from "@domain/entities/stock/stock.entity";
import { ISyncStockUseCase } from "./interfaces/sync-stock-usecase.interface";

@injectable()
export class SyncStocksUseCase implements ISyncStockUseCase {

  constructor(
    @inject(STOCK_TYPES.StockApiClient) private stockApiClient: IStockApiClient,
    @inject(STOCK_TYPES.StockRepository) private stockRepository: IStockRepository,
  ) { }

  async execute(): Promise<void> {

    const nseStocks = await this.stockApiClient.fetchNSEStocks();

    const stockEntities = nseStocks.map((dto) =>
      StockEntity.create({
        symbol: dto.symbol,
        name: dto.name,
        exchange: dto.exchange,
        sector: dto.sector ?? "",
        status: dto.status ?? "ACTIVE",
        isTradable: dto.isTradable ?? true,
      })
    );

    await this.stockRepository.saveMany(stockEntities);

    console.log(`Successfully synced ${stockEntities.length} stocks`);
  }
}