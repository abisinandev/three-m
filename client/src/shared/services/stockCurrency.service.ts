import axios from 'axios';

export interface RawStock {
    symbol: string;
    priceUSD: number;
    changeUSD: number;
}

export interface FormattedStock {
    symbol: string;
    priceUSD: number;
    priceINR: number;
    changeUSD: number;
    changeINR: number;
}

/**
 * Service to handle stock data transformation, currency conversion (USD to INR),
 * and formatting for real-time updates.
 */
class StockCurrencyService {
    private static instance: StockCurrencyService;
    private cachedRate: number = 83.0; // Fallback rate
    private lastFetchTime: number = 0;
    private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
    private readonly API_URL = 'https://open.er-api.com/v6/latest/USD';

    private constructor() {
        // Initial fetch of exchange rate
        this.getExchangeRate().catch(err => console.error('Initial exchange rate fetch failed:', err));
    }

    /**
     * Singleton instance provider
     */
    public static getInstance(): StockCurrencyService {
        if (!StockCurrencyService.instance) {
            StockCurrencyService.instance = new StockCurrencyService();
        }
        return StockCurrencyService.instance;
    }

    /**
     * Fetches the current USD to INR exchange rate from a public API.
     * Implements in-memory caching for 5-10 minutes.
     * @returns Promise<number> The exchange rate
     */
    public async getExchangeRate(): Promise<number> {
        const now = Date.now();
        
        // Return cached rate if still valid
        if (now - this.lastFetchTime < this.CACHE_DURATION) {
            return this.cachedRate;
        }

        try {
            const response = await axios.get(this.API_URL);
            const data = response.data;
            
            if (data && data.rates && data.rates.INR) {
                this.cachedRate = data.rates.INR;
                this.lastFetchTime = now;
            }
        } catch (error) {
            console.error('StockCurrencyService: Failed to fetch exchange rate, using fallback.', error);
            // If fetching fails, we keep using the previous cachedRate or default fallback
        }

        return this.cachedRate;
    }

    /**
     * Converts a USD value to INR using the cached exchange rate.
     * @param usd Value in USD
     * @returns number Value in INR
     */
    public convertUSDtoINR(usd: number): number {
        return Number((usd * this.cachedRate).toFixed(2));
    }

    /**
     * Transforms raw stock data from the backend into a UI-ready format.
     * Does not mutate original source data.
     * @param stock Raw stock object from backend (USD)
     * @returns FormattedStock UI-ready object with both USD and INR values
     */
    public formatStockData(stock: RawStock): FormattedStock {
        const priceINR = this.convertUSDtoINR(stock.priceUSD);
        const changeINR = this.convertUSDtoINR(stock.changeUSD);

        return {
            symbol: stock.symbol,
            priceUSD: Number(stock.priceUSD.toFixed(2)),
            priceINR: priceINR,
            changeUSD: Number(stock.changeUSD.toFixed(2)),
            changeINR: changeINR
        };
    }

    /**
     * Handler for real-time WebSocket updates.
     * Processes incoming stock data and returns formatted UI data.
     * @param stockUpdate Real-time data update
     * @returns FormattedStock
     */
    public handleRealtimeUpdate(stockUpdate: RawStock): FormattedStock {
        return this.formatStockData(stockUpdate);
    }

    /**
     * UI Helper to format values as currency strings.
     * @param value The numeric value
     * @param currency The currency type ('USD' or 'INR')
     * @returns string Formatted currency string
     */
    public formatCurrency(value: number, currency: 'USD' | 'INR' = 'INR'): string {
        const locale = currency === 'INR' ? 'en-IN' : 'en-US';
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }
}

// Export a singleton instance
export const stockCurrencyService = StockCurrencyService.getInstance();
export default stockCurrencyService;
