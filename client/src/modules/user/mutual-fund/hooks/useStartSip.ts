import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePremiumModalStore } from '@stores/user/PremiumModalStore';
import api from '@/lib/axios-user';
import { createIdempotencyKey } from '@/utils/uuid/generate-idempotency-key';
import { API_ROUTES } from '@/shared/constants/apiRoutes';

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
            const res = await api.post(API_ROUTES.USER.MUTUAL_FUNDS.START_SIP,
                payload,
                {
                    headers: { 'x-idempotency-key': createIdempotencyKey(payload as unknown as Parameters<typeof createIdempotencyKey>[0]) }
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
