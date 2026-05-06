import api from "@lib/axiosUser";
import { useQuery } from "@tanstack/react-query";
import type { Plan } from "@shared/types/subscription/subscription.types";


const subscriptionApi = {
    getPremiumPlan: async () => {
        const { data } = await api.get("/user/subscriptions/premium");
        return data.data as Plan;
    }
};

export const usePremiumPlan = () => {
    return useQuery({
        queryKey: ["premium-plan-info"],
        queryFn: subscriptionApi.getPremiumPlan,
    });
};

export default subscriptionApi;
