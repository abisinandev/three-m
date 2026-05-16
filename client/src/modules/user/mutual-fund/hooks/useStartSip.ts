import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePremiumModalStore } from '@stores/user/PremiumModalStore';
import api from '@/lib/axios-user';
import { createIdempotencyKey } from '@/utils/uuid/generate-idempotency-key';

interface SipPayload {
    schemeCode: string;
    amount: number;
    frequency: "DAILY" | 'WEEKLY' | "MONTHLY" | "YEARLY";
    startDate: string;
    totalInstallments: number;
    paymentMethod: 'WALLET';
}

export const useStartSip = <T = { message?: string; data?: unknown }>(
    onSuccess: (data: T) => void,
    onError: (msg: string, error?: unknown) => void
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: SipPayload) => {
            const res = await api.post('/user/mutual-funds/sip/create',
                payload,
                {
                    headers: { 'x-idempotency-key': createIdempotencyKey(payload) }
                }
            );
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['portfolio'] });
            queryClient.invalidateQueries({ queryKey: ['sip-investments'] });
            onSuccess(data);
        },
        onError: (error: { response?: { status?: number; data?: { message?: string } } }) => {
            if (error.response?.status === 402) {
                usePremiumModalStore.getState().onOpen();
            }
            const msg = error?.response?.data?.message || 'SIP creation failed. Please try again.';
            onError(msg, error);
        },
    });
};
