export const InvestmentType = {
    ONE_TIME: 'ONE_TIME',
    SIP: 'SIP',
} as const;

export type TInvestmentType =
    typeof InvestmentType[keyof typeof InvestmentType];

export const PaymentMethod = {
    WALLET: 'WALLET',
    UPI: 'UPI',
    NET_BANKING: 'NET_BANKING',
    DEBIT_CARD: 'DEBIT_CARD',
    CREDIT_CARD: 'CREDIT_CARD',
} as const;

export type PaymentMethod =
    typeof PaymentMethod[keyof typeof PaymentMethod];
