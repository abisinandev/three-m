import { useState, useRef, useEffect, useCallback } from 'react';
import { sendChatMessage, getChatHistory } from '@shared/services/chatbot/chatbot-api';
import type { ChatMessage } from '../types/chatbot.types';

export function useAiChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Hello! I am your Three-M Intelligence assistant. I specialize in General Queries, Financial Education, Portfolio Summaries, and Trade Execution. What would you like to explore?',
            timestamp: new Date(),
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [showQuickActions, setShowQuickActions] = useState(true);
    const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

    const historyLoaded = useRef(false);

    const fetchHistory = useCallback(async () => {
        if (!historyLoaded.current) {
            try {
                const history = await getChatHistory();
                if (history.length > 0) {
                    const loadedMessages: ChatMessage[] = history.map((msg, i) => ({
                        id: `history-${i}`,
                        role: msg.role,
                        content: msg.content,
                        timestamp: new Date(msg.timestamp),
                    }));
                    setMessages(loadedMessages);
                    setShowQuickActions(false);
                    historyLoaded.current = true;
                }
            } catch (error) {
                console.error("Failed to load chat history:", error);
            }
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchHistory();
        }
    }, [isOpen, fetchHistory]);

    const handleSendMessage = async (text: string) => {
        if (!text.trim() || isThinking) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: text.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsThinking(true);
        setShowQuickActions(false);

        try {
            const reply = await sendChatMessage(userMsg.content);
            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: reply.message,
                timestamp: new Date(),
                type: reply.type,
                data: reply.data,
                upgradeRequired: reply.upgradeRequired,
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            const errorMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Unable to process your request. Please try again later.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsThinking(false);
        }
    };

    const toggleOpen = () => setIsOpen(prev => !prev);
    const openPremiumModal = () => setIsPremiumModalOpen(true);
    const closePremiumModal = () => setIsPremiumModalOpen(false);

    return {
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
    };
}

