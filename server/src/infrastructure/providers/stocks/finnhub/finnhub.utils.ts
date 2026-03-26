import { StockModel } from "@infrastructure/databases/mongo_db/models/schemas/stock/stock.schema";
import { getLogo } from "./fetch-logo";
import { FinnhubStock, NormalizedStock } from "./finnhub-types";

export function normalizeStock(raw: FinnhubStock): NormalizedStock {
    return {
        symbol: raw.symbol,
        name: raw.description,
        exchange: raw.mic,

        isVisible: false,
        isTracked: true,
        isTradable: true,
        sector: "Unknown",

        logo: undefined
    };
}


export async function buildStock(raw: FinnhubStock): Promise<NormalizedStock> {
    const base = normalizeStock(raw);

    const logo = await getLogo(base.symbol);
    
    return {
        ...base,
        logo
    };
}


export async function saveStocks(stocks: NormalizedStock[]): Promise<void> {
    const ops = stocks.map(stock => ({
        updateOne: {
            filter: { symbol: stock.symbol },
            update: { $set: stock },
            upsert: true
        }
    }));

    await StockModel.bulkWrite(ops);
}