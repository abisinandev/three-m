import { Bot, Crown } from 'lucide-react';
import type { ChatMessage } from '../types/chatbot.types';

import { renderMarkdown } from '../utils/markdown';

interface ChatBubbleProps {
    message: ChatMessage;
    onUpgradeClick: () => void;
}

export function ChatBubble({ message, onUpgradeClick }: ChatBubbleProps) {
    const isAssistant = message.role === 'assistant';

    return (
        <div className={`flex ${!isAssistant ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            {isAssistant && (
                <div className="w-6 h-6 mt-0.5 mr-2.5 rounded-md bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Bot size={12} className="text-green-500" />
                </div>
            )}

            <div
                className={`
                    max-w-[85%] px-3.5 py-2.5 rounded-xl
                    ${!isAssistant
                        ? 'bg-neutral-800 text-neutral-100 rounded-tr-none border border-neutral-700/50'
                        : message.upgradeRequired
                            ? 'bg-neutral-900 border border-amber-500/20 text-neutral-300 rounded-tl-none'
                            : 'bg-neutral-900 border border-neutral-800/80 text-neutral-300 rounded-tl-none'
                    }
                `}
            >
                {!isAssistant ? (
                    <p className="text-[11px] leading-relaxed">{message.content}</p>
                ) : (
                    renderMarkdown(message.content)
                )}

                {message.upgradeRequired && (
                    <div className="mt-3 flex items-center justify-between gap-3 bg-amber-500/5 border border-amber-500/20 rounded-lg px-2.5 py-2">
                        <div className="flex items-center gap-1.5">
                            <Crown className="w-3 h-3 text-amber-500 shrink-0" />
                            <span className="text-[10px] text-amber-400 font-semibold">Premium feature</span>
                        </div>
                        <button
                            onClick={onUpgradeClick}
                            className="text-[9px] font-bold px-2 py-1 bg-amber-500 hover:bg-amber-400 text-black rounded transition-all whitespace-nowrap"
                        >
                            Upgrade
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
