import { inject, injectable } from "inversify";
import { AxiosHttpClient } from "../axios/http.client";
import { IStockApiClient } from "@application/interfaces/repositories/stock/stocks-api.interface";
import { env } from "@presentation/express/utils/constants/env.constants";
import { StockDTO } from "@application/dto/stocks/stock.dto";
import path from "path";
import { readCSV } from "@shared/utils/stock/csv-parser";

@injectable()
export class StockApiClient implements IStockApiClient {

    private readonly baseUrl = env.ALPHA_VANTAGE_BASE_URL;
    private readonly apiKey = env.ALPHA_VANTAGE_API_KEY;

    async fetchNYCStocks(): Promise<StockDTO[]> {
        return []
    }
    // 📌📌📌📌📌📌 not using anywhere
    
    // async fetchNSEStocks(): Promise<StockDTO[]> {
    //     const csv = await this.http.get<string>(
    //         "https://archives.nseindia.com/content/equities/EQUITY_L.csv"
    //     );

    //     const parsed = Papa.parse<any>(csv, {
    //         header: true,
    //         skipEmptyLines: true
    //     });

    //     return parsed.data
    // }

    // async fetchUSStocks(): Promise<StockDTO[]> {
    //     const url = `${this.baseUrl}?function=LISTING_STATUS&state=active&apikey=${this.apiKey}`;

    //     const csv = await this.http.get<string>(url);

    //     const parsed = Papa.parse<any>(csv, {
    //         header: true,
    //         skipEmptyLines: true
    //     });

    //     return parsed.data
    // }

    // async fetchBSEStocks(): Promise<StockDTO[]> {

    //     const csv = await this.http.get<string>(
    //         "hhttps://www.bseindia.com/download/BhavCopy/Equity/EQ_ISINCODE_20260310.zip"
    //     );

    //     const parsed = Papa.parse<any>(csv, {
    //         header: true,
    //         skipEmptyLines: true
    //     });

    //     return parsed.data
    // }
}