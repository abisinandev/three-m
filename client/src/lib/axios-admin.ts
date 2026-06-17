
import { useAdminStore } from "@stores/admin/useAdminStore";
import { notFound, redirect } from '@tanstack/react-router'
import axios, { isAxiosError, type InternalAxiosRequestConfig } from "axios";
import { ROUTES, API_ROUTES } from '@shared/constants/apiRoutes';

const adminApi = axios.create({
    baseURL: import.meta.env.VITE_ADMIN_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});


interface RetryConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
    _retryCount?: number;
}

let isRefreshing = false;

adminApi.interceptors.response.use(
    res => res,
    async (err: unknown) => {
        if (!isAxiosError(err)) {
            return Promise.reject(err);
        }
        const originalRequest = err.config as RetryConfig;
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
                setTimeout(() => resolve(adminApi(originalRequest)), delay)
            );
        }

        if (err.response?.status === 403) {
            throw notFound();
        }

        if (err.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    await adminApi.post(API_ROUTES.ADMIN.AUTH.REFRESH_TOKEN, {}, { withCredentials: true });
                } catch {
                    useAdminStore.getState().logout();
                    throw redirect({ to: ROUTES.ADMIN.AUTH.LOGIN })
                } finally {
                    isRefreshing = false
                }
            }

            return adminApi(originalRequest);
        }

        return Promise.reject(err)
    }
)

export default adminApi;
