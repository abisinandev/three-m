import { useMutation, useQueryClient } from '@tanstack/react-query';
import { startSip } from '@shared/services/feature/mutual-fund/MutualFundApisUserSide';
import { usePremiumModalStore } from '@stores/user/PremiumModalStore';

interface SipPayload {
    schemeCode: string;
    amount: number;
    frequency: "DAILY" | 'WEEKLY' | "MONTHLY" | "YEARLY";
    startDate: string;
    totalInstallments: number;
    paymentMethod: 'WALLET';
}

export const useStartSip = (onSuccess: (data: any) => void, onError: (msg: string, error?: any) => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: SipPayload) => {
            const res = await startSip(payload);
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['portfolio'] });
            queryClient.invalidateQueries({ queryKey: ['sip-investments'] }); // Assuming there might be a sip list query
            onSuccess(data);
        },
        onError: (error: any) => {
            if (error.response?.status === 402) {
                usePremiumModalStore.getState().onOpen();
            }
            const msg = error?.response?.data?.message || 'SIP creation failed. Please try again.';
            onError(msg, error);
        },
    });
};
