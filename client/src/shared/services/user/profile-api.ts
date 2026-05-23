import api from "@/lib/axios-user";
import { API_ROUTES } from "@shared/constants/apiRoutes";
import { useQuery } from "@tanstack/react-query";
import type { UserType } from "@shared/types/user/UserType";

export const ProfileApi = async (): Promise<{ data: UserType } | UserType> => {
    const response = await api.get(
        API_ROUTES.USER.PROFILE.GET,
        { withCredentials: true }
    )
    return response.data;
}

export const useProfileQuery = () =>
    useQuery({
        queryKey: ['profile'],
        queryFn: ProfileApi,
        staleTime: 1000 * 60 * 30, // 30 minutes
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
    });
