import adminApi from "@/lib/axios-admin";
import { API_ROUTES } from "@shared/constants/apiRoutes";
import type { TransactionFilters } from "@shared/types/admin/transaction.types";


export const TransactionsApi = async ({ page, limit, search, status }: TransactionFilters) => {
  const response = await adminApi.get(API_ROUTES.ADMIN.TRANSACTIONS.GET_ALL, {
    params: { page, limit, search, status },
  });
  return response.data;
};