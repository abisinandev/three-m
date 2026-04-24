import { useRef } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSend: (text: string) => void;
    isThinking: boolean;
}

export function ChatInput({ value, onChange, onSend, isThinking }: ChatInputProps) {
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend(value);
        }
    };

    return (
        <div className="p-4 bg-neutral-950 border-t border-neutral-800">
            <div className="relative flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl px-2 py-1.5 focus-within:border-green-500/40 transition-colors">
                <textarea
                    ref={inputRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    rows={1}
                    className="
                        flex-1 bg-transparent outline-none resize-none max-h-[100px] py-1.5 px-2
                        text-[11px] placeholder:text-neutral-600 text-neutral-200 leading-relaxed
                    "
                />
                <button
                    onClick={() => onSend(value)}
                    disabled={!value.trim() || isThinking}
                    className={`
                        h-7 w-7 flex-shrink-0 flex items-center justify-center rounded-lg transition-all
                        ${value.trim() && !isThinking
                            ? 'bg-green-600 text-white shadow-md shadow-green-900/20 hover:bg-green-500 active:scale-95'
                            : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'}
                    `}
                >
                    <Send size={12} />
                </button>
            </div>

            <div className="mt-3 text-center">
                <p className="text-[9px] text-neutral-600 font-medium">
                    AI insights are advisory • Verify prior to execution
                </p>
            </div>
        </div>
    );
}
