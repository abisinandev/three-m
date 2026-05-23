import { useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { ChatBubble } from './ChatBubble';
import { QuickActions } from './QuickActions';
import { OrderPreview } from './OrderPreview';
import { StockSuggestionList } from './StockSuggestionList';
import type { ChatMessage, BotStock } from '../types/chatbot.types';

interface ChatMessageListProps {
    messages: ChatMessage[];
    isThinking: boolean;
    showQuickActions: boolean;
    onAction: (prompt: string) => void;
    onUpgradeClick: () => void;
}

interface OrderData {
    symbol: string;
    qty: number;
    price: number;
    total: number;
    name: string;
}

export function ChatMessageList({
    messages,
    isThinking,
    showQuickActions,
    onAction,
    onUpgradeClick
}: ChatMessageListProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isThinking]);

    return (
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 scrollbar-hide">
            {messages.map((msg) => (
                <div key={msg.id}>
                    <ChatBubble
                        message={msg}
                        onUpgradeClick={onUpgradeClick}
                    />
                    {msg.type === 'confirmation' && msg.data ? (
                        <OrderPreview data={msg.data as unknown as OrderData} />
                    ) : null}
                    {msg.type === 'suggestion_list' && msg.data ? (
                        <StockSuggestionList stocks={msg.data as unknown as BotStock[]} />
                    ) : null}
                </div>
            ))}

            {showQuickActions && messages.length <= 1 && (
                <QuickActions onAction={onAction} />
            )}

            {isThinking && (
                <div className="flex items-center gap-2 pl-9 animate-pulse">
                    <div className="w-5 h-5 rounded-md bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                        <Loader2 size={10} className="text-green-500 animate-spin" />
                    </div>
                    <span className="text-[10px] font-medium text-neutral-500">Processing...</span>
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    );
}
