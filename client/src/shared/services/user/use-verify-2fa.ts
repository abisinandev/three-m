import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios-user";
import { API_ROUTES } from "@shared/constants/apiRoutes";

export const useVerify2FA = () => {
    return useMutation({
        mutationFn: async ({ email, code }: { email: string; code: string }) => {
            const res = await api.post(API_ROUTES.USER.AUTH.TWO_FACTOR_VERIFY(email), { token: code });
            return res;
        },
    });
};
