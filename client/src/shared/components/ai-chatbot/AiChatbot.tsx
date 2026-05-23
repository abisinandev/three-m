import { useAiChatbot } from './hooks/useAiChatbot';
import { ChatTriggerButton } from './components/ChatTriggerButton';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessageList } from './components/ChatMessageList';
import { ChatInput } from './components/ChatInput';
import PremiumPaymentModal from '@/shared/components/modals/premium-payment/PremiumPaymentModal';

export default function AiAssistantPanel() {
    const {
        isOpen,
        messages,
        inputValue,
        isThinking,
        showQuickActions,
        isPremiumModalOpen,
        setInputValue,
        handleSendMessage,
        toggleOpen,
        openPremiumModal,
        closePremiumModal,
    } = useAiChatbot();

    return (
        <>
            <ChatTriggerButton onClick={toggleOpen} />

            <div
                className={`
                    fixed inset-y-0 right-0 z-[200] w-[400px]
                    bg-neutral-950/98 backdrop-blur-3xl border-l border-neutral-800/80
                    flex flex-col shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]
                    transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.03),transparent_40%)] pointer-events-none" />
                <ChatHeader onClose={toggleOpen} />

                <ChatMessageList
                    messages={messages}
                    isThinking={isThinking}
                    showQuickActions={showQuickActions}
                    onAction={handleSendMessage}
                    onUpgradeClick={openPremiumModal}
                />

                <ChatInput
                    value={inputValue}
                    onChange={setInputValue}
                    onSend={handleSendMessage}
                    isThinking={isThinking}
                />
            </div>

            <PremiumPaymentModal
                isOpen={isPremiumModalOpen}
                onClose={closePremiumModal}
            />

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
