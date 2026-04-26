export interface ICheckUserBlockedUseCase {
  execute(id: string): Promise<boolean>;
}
