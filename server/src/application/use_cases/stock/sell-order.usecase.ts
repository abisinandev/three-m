import { injectable } from "inversify";
import { IMarketSellOrderUseCase } from "./interfaces/sell-order-usecase.interface";
import { SellOrderDTO } from "@application/dto/stocks/SellOrderDTO";

@injectable()
export class MarketSellOrderUseCase implements IMarketSellOrderUseCase {
    constructor(

    ){}

    async execute(data: SellOrderDTO, userId: string): Promise<void> {

    }
}