import { MessageSquareText, GraduationCap, Briefcase, BarChart3 } from 'lucide-react';
import type { QuickAction } from '../types/chatbot.types';


export const QUICK_ACTIONS: QuickAction[] = [
    { id: 'queries', label: 'General Queries', icon: MessageSquareText, prompt: "I have a general question." },
    { id: 'education', label: 'Financial Education', icon: GraduationCap, prompt: "Can you teach me about some financial concepts?" },
    { id: 'portfolio', label: 'Portfolio Summary', icon: Briefcase, prompt: "portfolio summary" },
    { id: 'trade', label: 'Execute Trade', icon: BarChart3, prompt: "I would like to execute a trade." },
];
