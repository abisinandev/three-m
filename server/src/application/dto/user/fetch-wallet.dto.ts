export interface FetchWalletDTO<T> {
  data: T;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
//   totalActiveUsersCount?: number;
//   totalInActiveUsersCount?: number;
//   totalVerifiedUsersCount?:number
}
