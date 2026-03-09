// src/shared/components/ai-chatbot/AiChatbot.tsx
import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Loader2, Sparkles, MessageSquare, ShieldCheck, Zap } from 'lucide-react';
import { sendChatMessage } from '@shared/services/chatbot/chatbotApi';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    type?: 'text' | 'confirmation';
}

export default function AiAssistantPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Good afternoon. I’m ready to assist with portfolio analysis, fund recommendations, risk assessment, or trade execution. What would you like to explore?',
            timestamp: new Date(),
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isThinking, setIsThinking] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    const sendMessage = async () => {
        if (!inputValue.trim() || isThinking) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsThinking(true);

        try {
            const reply = await sendChatMessage(userMsg.content);
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: reply,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch {
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Unable to get a response right now. Please try again.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsThinking(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            <div className="fixed bottom-8 right-8 z-[100] group">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-[#3b82f6] opacity-20 blur-xl rounded-full group-hover:opacity-40 transition-opacity duration-500" />

                <button
                    onClick={() => setIsOpen(true)}
                    className="
                        relative h-14 bg-[#0a0a0a] border border-[#3b82f6]/20
                        rounded-full flex items-center overflow-hidden
                        transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                        hover:border-[#3b82f6]/50 hover:bg-[#111]
                        active:scale-[0.96] shadow-2xl
                    "
                >
                    {/* Text slides in with a subtle fade */}
                    <div className="overflow-hidden max-w-0 group-hover:max-w-[140px] transition-all duration-500 ease-in-out">
                        <span className="
                            pl-6 pr-2 text-[13px] font-semibold text-white tracking-wide whitespace-nowrap
                            opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0
                            transition-all duration-500 delay-100
                        ">
                            threeM Intelligence
                        </span>
                    </div>

                    {/* Icon Container */}
                    <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Sparkles size={22} className="text-[#3b82f6] relative z-10 animate-pulse-slow" />
                    </div>
                </button>
            </div>

            <div
                className={`
                    fixed inset-y-0 right-0 z-[200] w-[420px]
                    bg-[#050505]/95 backdrop-blur-2xl border-l border-[#ffffff0a]
                    flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]
                    transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                {/* Decorative top gradient line */}
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#3b82f6]/30 to-transparent" />

                {/* Header */}
                <div className="px-6 py-5 flex items-center justify-between border-b border-[#ffffff08]">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] shadow-[0_0_10px_#3b82f6]" />
                            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-[#3b82f6] animate-ping opacity-40" />
                        </div>
                        <div>
                            <h3 className="text-[14px] font-bold text-white tracking-tight flex items-center gap-1.5">
                                threeM Assistant
                                <ShieldCheck size={14} className="text-[#3b82f6]/80" />
                            </h3>
                            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-[0.1em]">Secure Financial Intelligence</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-[#ffffff08] transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 scrollbar-hide">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                        >
                            {msg.role === 'assistant' && (
                                <div className="w-6 h-6 mt-1 mr-3 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center flex-shrink-0">
                                    <Bot size={14} className="text-[#3b82f6]" />
                                </div>
                            )}

                            <div
                                className={`
                                    max-w-[85%] px-4 py-3.5 rounded-2xl text-[13px] leading-[1.6]
                                    ${msg.role === 'user'
                                        ? 'bg-[#1a1a1a] text-white rounded-tr-none border border-[#ffffff0a]'
                                        : 'bg-[#111] border border-[#ffffff08] text-gray-200 rounded-tl-none'
                                    }
                                    shadow-sm
                                `}
                            >
                                {msg.content}

                                {msg.type === 'confirmation' && (
                                    <div className="mt-5 bg-black/40 border border-[#ffffff0a] rounded-xl overflow-hidden backdrop-blur-md">
                                        <div className="px-4 py-3 bg-[#ffffff05] flex justify-between items-center border-b border-[#ffffff08]">
                                            <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Order Preview</span>
                                            <Zap size={12} className="text-[#3b82f6]" />
                                        </div>
                                        <div className="px-4 py-4 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <span className="text-gray-500 text-[11px] font-medium">INVESTMENT</span>
                                                <span className="text-white text-right font-semibold leading-tight max-w-[140px]">
                                                    Parag Parikh Flexi Cap Direct
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500 text-[11px] font-medium">AMOUNT</span>
                                                <span className="text-[#3b82f6] font-bold text-base">₹45,000.00</span>
                                            </div>
                                            <div className="flex justify-between items-center bg-[#ffffff03] p-2 rounded-lg border border-[#ffffff05]">
                                                <span className="text-gray-500 text-[11px] font-medium">SETTLEMENT</span>
                                                <span className="text-gray-300 text-[12px] font-medium">HDFC •••• 4782</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 border-t border-[#ffffff08]">
                                            <button
                                                onClick={() => alert('Order cancelled')}
                                                className="py-3.5 text-[11px] font-bold text-gray-400 hover:text-white hover:bg-[#ffffff05] transition-all border-r border-[#ffffff08]"
                                            >
                                                DISMISS
                                            </button>
                                            <button
                                                onClick={() => alert('Order executed successfully')}
                                                className="py-3.5 text-[11px] font-bold bg-[#3b82f6] text-black hover:bg-[#60a5fa] transition-all"
                                            >
                                                EXECUTE TRADE
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isThinking && (
                        <div className="flex items-center gap-3 pl-9 animate-pulse">
                            <div className="w-6 h-6 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center">
                                <Loader2 size={13} className="text-[#3b82f6] animate-spin" />
                            </div>
                            <span className="text-[11px] font-medium text-gray-500 tracking-wide">Syncing market intelligence...</span>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 bg-gradient-to-t from-[#0a0a0a] to-transparent border-t border-[#ffffff05]">
                    <div className="relative group/input flex items-end gap-3 bg-[#111] border border-[#ffffff08] rounded-2xl p-3 focus-within:border-[#3b82f6]/40 transition-all duration-300">
                        <textarea
                            ref={inputRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            rows={1}
                            className="
                                flex-1 bg-transparent outline-none resize-none max-h-[120px] py-1.5 px-1
                                text-[13px] placeholder:text-gray-600 text-gray-200 leading-relaxed
                            "
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!inputValue.trim() || isThinking}
                            className={`
                                h-9 w-9 flex items-center justify-center rounded-xl transition-all duration-300
                                ${inputValue.trim() && !isThinking
                                    ? 'bg-[#3b82f6] text-black shadow-[0_4px_12px_rgba(59,130,246,0.3)] hover:scale-105 active:scale-95'
                                    : 'bg-[#1a1a1a] text-gray-700 cursor-not-allowed'}
                            `}
                        >
                            <Send size={16} />
                        </button>
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-2">
                        <MessageSquare size={10} className="text-gray-600" />
                        <p className="text-[10px] text-gray-600 font-medium tracking-tight">
                            AI-driven insights are advisory • Always verify significant trades
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                .animate-pulse-slow {
                    animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.6; }
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </>
    );
}
