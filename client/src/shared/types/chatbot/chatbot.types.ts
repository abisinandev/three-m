export interface ChatHistoryMessage {
    role: "user" | "assistant";
    content: string;
    timestamp: number;
}

export interface ChatResponse {
    message: string;
    type?: 'text' | 'confirmation' | 'suggestion_list' | 'portfolio_summary';
    data?: any;
    upgradeRequired?: boolean;
}
