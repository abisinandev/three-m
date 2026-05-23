export interface IUnblockUserUsecase {
  execute(id: string): Promise<void>;
}
