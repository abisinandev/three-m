export interface PremiumPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export interface PlanData {
    id: string;
    name: string;
    price: string | number;
    durationInDays: number;
    features: string[];
}
