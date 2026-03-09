import adminApi from "@lib/axiosAdmin";
import { API_ROUTES } from "@shared/constants/apiRoutes";

type Props = {
  page: number;
  limit: number;
  search?: string;
  status?: string;
};

export const TransactionsApi = async ({ page, limit, search, status }: Props) => {
  const response = await adminApi.get(API_ROUTES.ADMIN.TRANSACTIONS.GET_ALL, {
    params: { page, limit, search, status },
  });
  return response.data;
};