export interface StockData {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    sparkline: number[];
}

export const DUMMY_STOCKS: StockData[] = [
    {
        symbol: "RELIANCE",
        name: "Reliance Industries",
        price: 2984.50,
        change: 45.20,
        changePercent: 1.54,
        sparkline: [2800, 2810, 2790, 2850, 2900, 2950, 2984.50],
    },
    {
        symbol: "TCS",
        name: "Tata Consultancy",
        price: 4120.75,
        change: -25.30,
        changePercent: -0.61,
        sparkline: [4200, 4190, 4150, 4210, 4180, 4150, 4120.75],
    },
    {
        symbol: "HDFCBANK",
        name: "HDFC Bank Ltd.",
        price: 1532.10,
        change: 12.80,
        changePercent: 0.84,
        sparkline: [1500, 1510, 1490, 1520, 1530, 1515, 1532.10],
    },
    {
        symbol: "INFY",
        name: "Infosys Ltd.",
        price: 1640.25,
        change: 18.40,
        changePercent: 1.13,
        sparkline: [1600, 1610, 1620, 1590, 1630, 1625, 1640.25],
    },
    {
        symbol: "ICICIBANK",
        name: "ICICI Bank Ltd.",
        price: 1084.60,
        change: -5.45,
        changePercent: -0.50,
        sparkline: [1090, 1100, 1085, 1080, 1095, 1080, 1084.60],
    },
    {
        symbol: "SBIN",
        name: "State Bank of India",
        price: 780.30,
        change: 8.15,
        changePercent: 1.05,
        sparkline: [750, 760, 755, 765, 770, 775, 780.30],
    },
    {
        symbol: "BHARTIARTL",
        name: "Bharti Airtel",
        price: 1245.80,
        change: -12.30,
        changePercent: -0.98,
        sparkline: [1260, 1270, 1250, 1240, 1255, 1250, 1245.80],
    },
    {
        symbol: "ITC",
        name: "ITC Ltd.",
        price: 435.60,
        change: 2.10,
        changePercent: 0.48,
        sparkline: [430, 432, 428, 435, 434, 432, 435.60],
    }
];

export const INDICES = [
    { name: "NIFTY 50", value: 22530.45, change: 112.50, changePercent: 0.50 },
    { name: "SENSEX", value: 74210.80, change: 380.20, changePercent: 0.51 },
    { name: "BTC/INR", value: 5824500, change: -125000, changePercent: -2.10 },
];

export const RECENT_ACTIVITY = [
    { type: 'buy', symbol: 'RELIANCE', qty: 10, price: 2950.00, time: '10:45 AM' },
    { type: 'view', symbol: 'TCS', qty: null, price: 4120.75, time: '11:12 AM' },
    { type: 'sell', symbol: 'HDFCBANK', qty: 25, price: 1530.00, time: '01:20 PM' },
    { type: 'buy', symbol: 'INFY', qty: 50, price: 1625.50, time: '02:05 PM' },
];
