import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@lib/axiosUser';
import type { InvestmentPayload } from '../types/mutual-fund.types';
import { createIdempotencyKey } from '@/utils/uuid/generate-idempotency-key';


export const useInvestMutualFund = <T = { data?: unknown }>(onSuccess: (data: T) => void, onError: (msg: string) => void) => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: InvestmentPayload) => {
            const res = await api.post('/user/mutual-funds/investment/one-time',
                payload,
                {
                    headers: { 'x-idempotency-key': createIdempotencyKey(payload) }
                }
            );
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['portfolio'] });
            onSuccess(data);
        },

        onError: (error: { response?: { data?: { message?: string } } }) => {
            const msg = error?.response?.data?.message || 'Investment failed. Please try again.';
            onError(msg);
        },
    });
};
