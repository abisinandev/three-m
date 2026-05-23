export interface InvestmentPayload {
    schemeCode: string;
    amount: number;
    units: number;
    paymentMethod: 'WALLET';
    investmentType: 'ONE_TIME';
}