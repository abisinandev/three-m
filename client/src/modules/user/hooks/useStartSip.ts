import { useMutation, useQueryClient } from '@tanstack/react-query';
import { startSip } from '@shared/services/feature/mutual-fund/MutualFundApisUserSide';

interface SipPayload {
    schemeCode: string;
    amount: number;
    frequency: "DAILY" | 'WEEKLY' | "MONTHLY" | "YEARLY";
    startDate: string;
    totalInstallments: number;
    paymentMethod: 'WALLET';
}

export const useStartSip = (onSuccess: (data: any) => void, onError: (msg: string) => void) => {
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
            const msg = error?.response?.data?.message || 'SIP creation failed. Please try again.';
            onError(msg);
        },
    });
};
