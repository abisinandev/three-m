export interface IAdminLogoutUseCase {
  execute(data: { id: string; adminCode?: string }): Promise<void>;
}
