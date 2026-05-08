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
                <div className="w-8 h-8 mt-1 mr-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/5">
                    <Bot size={16} className="text-green-500" />
                </div>
            )}

            <div
                className={`
                    max-w-[85%] px-4 py-3 rounded-2xl shadow-sm
                    ${!isAssistant
                        ? 'bg-gradient-to-br from-neutral-800 to-neutral-900 text-neutral-100 rounded-tr-none border border-neutral-700/50'
                        : message.upgradeRequired
                            ? 'bg-neutral-900/50 backdrop-blur-sm border border-amber-500/30 text-neutral-300 rounded-tl-none shadow-amber-500/5'
                            : 'bg-neutral-900/40 backdrop-blur-sm border border-neutral-800/80 text-neutral-300 rounded-tl-none'
                    }
                `}
            >
                {!isAssistant ? (
                    <p className="text-[12px] leading-relaxed font-medium tracking-tight">{message.content}</p>
                ) : (
                    <div className="text-[12px] leading-relaxed prose prose-invert prose-p:my-0 prose-strong:text-green-500">
                        {renderMarkdown(message.content)}
                    </div>
                )}

                {message.upgradeRequired && (
                    <div className="mt-4 flex items-center justify-between gap-4 bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 rounded-xl px-3 py-2.5">
                        <div className="flex items-center gap-2">
                            <div className="p-1 rounded-md bg-amber-500/20">
                                <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Premium Access</span>
                                <span className="text-[9px] text-neutral-500">Unlock advanced AI analysis</span>
                            </div>
                        </div>
                        <button
                            onClick={onUpgradeClick}
                            className="text-[10px] font-bold px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-lg transition-all transform active:scale-95 shadow-lg shadow-amber-500/10"
                        >
                            UPGRADE
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
