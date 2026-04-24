export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    type?: 'text' | 'confirmation';
    upgradeRequired?: boolean;
}

export interface QuickAction {
    id: string;
    label: string;
    icon: React.ElementType;
    prompt: string;
}
