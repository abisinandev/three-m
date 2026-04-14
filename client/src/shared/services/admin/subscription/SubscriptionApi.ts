import api from "@lib/axiosUser";
import { useQuery } from "@tanstack/react-query";

export interface Plan {
    code: string;
    price: number;
    durationInDays: number;
    features: string[];
    isActive: boolean;
}

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
