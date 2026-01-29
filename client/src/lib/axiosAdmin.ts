import { REFRESH_TOKEN_URL } from "@shared/constants/adminConstants";
import { useAdminStore } from "@stores/admin/useAdminStore";
import { redirect } from '@tanstack/react-router'
import axios from "axios";

const adminApi = axios.create({
    baseURL: import.meta.env.VITE_ADMIN_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});


let isRefreshing = false;

adminApi.interceptors.response.use(
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

        if (err.response.status === 403) {
            useAdminStore.getState().logout();
            throw redirect({ to: "/admin/authentication" })
        }

        if (err.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    await adminApi.post(REFRESH_TOKEN_URL, {}, { withCredentials: true });
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
