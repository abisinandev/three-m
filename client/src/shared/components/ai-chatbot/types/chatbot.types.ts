export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    type?: 'text' | 'confirmation' | 'suggestion_list' | 'portfolio_summary';
    data?: any;
    upgradeRequired?: boolean;
}

export interface BotStock {
    id: string;
    symbol: string;
    name: string;
    price: number | null;
    changePercent?: number;
    logo?: string | null;
}

export interface QuickAction {
    id: string;
    label: string;
    icon: React.ElementType;
    prompt: string;
}
