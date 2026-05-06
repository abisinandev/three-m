import adminApi from "@/lib/axios-admin"
import { API_ROUTES } from "@shared/constants/apiRoutes"
import type { KycFilters } from "@shared/types/admin/user-management.types";

export const fetchKycUsers = async ({ page = 1, status = "pending" }: KycFilters) => {

    const res = await adminApi.get(API_ROUTES.ADMIN.KYC.GET_ALL,
        {
            params: { page, limit: 10, status },
        });

    return res.data.data;
};

export const FetchUserKycApi = async (kycId: string) => {
    console.log("kyc: ", kycId)
    const response = await adminApi.get(API_ROUTES.ADMIN.KYC.VIEW(kycId));
    console.log("FetchUserKycApi: ", response.data)
    return response.data
}

export const approveKycApi = async (kycId: string) => {
    await adminApi.patch(API_ROUTES.ADMIN.KYC.APPROVE(kycId));
}
export const rejectKycApi = async (kycId: string, reason: string) => {
    adminApi.patch(API_ROUTES.ADMIN.KYC.REJECT(kycId), { reason });
}