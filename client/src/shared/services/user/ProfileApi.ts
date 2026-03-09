import api from "@lib/axiosUser";
import { API_ROUTES } from "@shared/constants/apiRoutes";
import { useQuery } from "@tanstack/react-query";

export const ProfileApi = async () => {
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
        staleTime: 1000 * 60 * 5,
        retry: false,
    });
