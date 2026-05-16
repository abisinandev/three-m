import axios from "axios"
import { useUserStore } from "@stores/user/UserStore";
import { redirect, notFound } from '@tanstack/react-router'
import { USER_REFRESH_TOKEN } from "@shared/constants/userContants";
import { ROUTES } from "@shared/constants/routes";

const api = axios.create({
    baseURL: import.meta.env.VITE_USER_BASE_URL,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
})

const authFreeRoutes = [
    "/auth/login",
    "/auth/signup",
];

let isRefreshing = false;
api.interceptors.response.use(
    res => res,
    async (err) => {
        const originalRequest = err.config;
        console.log("originalRequest: ", originalRequest);

        const isServerRestart =
            err.code === "ECONNRESET" ||
            err.code === "ECONNREFUSED" ||
            err.code === 'ERR_BAD_RESPONSE' ||
            err.message === "Network Error" ||
            (err.response && err.response.status === 0) ||
            (err.response && (
                err.response.status === 0 ||
                new Set([500, 502, 503]).has(err.response.status)
            ));

        if (authFreeRoutes.some(route => originalRequest.url?.includes(route))) {
            return Promise.reject(err);
        }

        if (isServerRestart) {
            originalRequest._retryCount = originalRequest._retryCount || 0;

            if (originalRequest._retryCount >= 3) {
                console.log("Server unreachable after 3 retries");
                return Promise.reject(err);
            }

            originalRequest._retryCount++;
            const delay = 1000 * Math.pow(2, originalRequest._retryCount);
            console.log("⚠ Server restarting… retrying in 2s");

            return new Promise((resolve) =>
                setTimeout(() => resolve(api(originalRequest)), delay)
            );
        }

        if (err.response?.status === 403) {
            throw notFound();
        }

        if (err.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    await api.post(USER_REFRESH_TOKEN, {}, { withCredentials: true });
                } catch {

                    useUserStore.getState().logout();
                    throw redirect({ to: ROUTES.AUTH.LOGIN })
                    
                } finally {
                    isRefreshing = false
                }
            }

            return api(originalRequest);
        }

        return Promise.reject(err)
    }
)

export default api
