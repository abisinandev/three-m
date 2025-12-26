import adminApi from "@lib/axiosAdmin";

type Props = {
  page: number;
  limit: number;
  search?: string;
  status?: string;
};

export const TransactionsApi = async ({ page, limit, search, status }: Props) => {
  const response = await adminApi.get('/transactions', {
    params: { page, limit, search, status },
  });
  return response.data;  
};