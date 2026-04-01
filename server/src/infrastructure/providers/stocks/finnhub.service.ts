import { IFinnhubService } from "@application/interfaces/services/stocks/finnhub-service.interface";
import { env } from "@presentation/express/utils/constants/env.constants";
import axios from "axios";
import { injectable } from "inversify";

@injectable()
export class FinnhubService implements IFinnhubService {

    async getQuote(symbol: string): Promise<number | null> {
        const res = await axios.get(
            env.FINNHUB_QUOTE_PRICE,
            { params: { symbol, token: env.FINNHUB_API_KEY_SECRET } }
        );

        const price = res.data.c || res.data.pc;
        return price > 0 ? price : null;
    }
}