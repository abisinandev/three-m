
class StockCurrencyService {
    private static instance: StockCurrencyService;

    private constructor() {}

    public static getInstance(): StockCurrencyService {
        if (!StockCurrencyService.instance) {
            StockCurrencyService.instance = new StockCurrencyService();
        }
        return StockCurrencyService.instance;
    }

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

    public formatPercentage(value: number | null | undefined): string {
        if (value == null) return '0.00%';
        return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
    }
}

export const stockCurrencyService = StockCurrencyService.getInstance();
export default stockCurrencyService;

