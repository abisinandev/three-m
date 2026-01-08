import api from "@lib/axiosUser";
import { PROFILE_GET_API } from "@shared/constants/userContants";
import { useQuery } from "@tanstack/react-query";

export const ProfileApi = async () => {
    const response = await api.get(
        PROFILE_GET_API,
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
