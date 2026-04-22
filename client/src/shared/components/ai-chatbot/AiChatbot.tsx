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
                    bg-neutral-950/95 backdrop-blur-2xl border-l border-neutral-800/50
                    flex flex-col shadow-2xl
                    transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
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
