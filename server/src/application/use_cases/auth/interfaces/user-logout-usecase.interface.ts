export interface IUserLogoutUseCase {
  execute(data: { userId: string }): Promise<void>;
}
