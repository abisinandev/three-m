/**
 * Service to handle stock data formatting for UI display.
 * Since the backend and frontend are now fully dealing with INR,
 * conversion logic has been removed.
 */
class StockCurrencyService {
    private static instance: StockCurrencyService;

    private constructor() {}

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
     * UI Helper to format values as currency strings.
     * @param value The numeric value
     * @param currency The currency type (default 'INR')
     * @returns string Formatted currency string
     */
    public formatCurrency(value: number | null | undefined, currency: 'USD' | 'INR' = 'INR'): string {
        if (value == null) return '—';
        
        const locale = currency === 'INR' ? 'en-IN' : 'en-US';
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }

    /**
     * Helper for percentage strings
     */
    public formatPercentage(value: number | null | undefined): string {
        if (value == null) return '0.00%';
        return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
    }
}

// Export a singleton instance
export const stockCurrencyService = StockCurrencyService.getInstance();
export default stockCurrencyService;

