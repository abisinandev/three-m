export const StrategyMetadata = [
    {
        name: "MA",
        displayName: "Moving Average",
        configSchema: [
            { key: "shortPeriod", type: "number", default: 5 },
            { key: "longPeriod", type: "number", default: 10 }
        ]
    },
    {
        name: "RSI",
        displayName: "RSI",
        configSchema: [
            { key: "period", type: "number", default: 14 }
        ]
    }
];