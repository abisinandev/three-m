import { injectable, inject } from "inversify";
import { IStockSearchProvider, ISearchedStock } from "../../../../application/interfaces/repositories/stock/stock-search-provider.interface";
import { IHttpClient } from "../../../../application/interfaces/services/externals/http-client-interface";
import { env } from "@presentation/express/utils/constants/env.constants";
import { EXTERNAL_TYPES } from "@infrastructure/inversify_di/features/external/external.types";

interface TwelveDataSearchResponse {
    symbol: string;
    instrument_name: string;
    exchange: string;
    country: string;
    currency: string;
    instrument_type: string;
}

@injectable()
export class TwelveDataSearchProvider implements IStockSearchProvider {
    private readonly baseUrl = env.TWELVE_DATA_API;

    constructor(
        @inject(EXTERNAL_TYPES.HttpClient) private readonly _httpClient: IHttpClient
    ) { }

    async search(query: string): Promise<ISearchedStock[]> {
        const url = `${this.baseUrl}?symbol=${encodeURIComponent(query)}&apikey=${env.TWELVE_DATA_API_KEY}`;
        const response = await this._httpClient.get<{ data: TwelveDataSearchResponse[] }>(url);

        if (!response || !response.data) {
            return [];
        }

        return response.data
            .filter(item => item.exchange === "NSE" || item.exchange === "BSE")
            .map(item => ({
                symbol: item.symbol,
                name: item.instrument_name,
                exchange: item.exchange,
                country: item.country,
                currency: item.currency,
                type: item.instrument_type
            }));
    }
}
