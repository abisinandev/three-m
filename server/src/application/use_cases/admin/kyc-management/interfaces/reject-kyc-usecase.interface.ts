export interface IRejectKycUseCase {
  execute(data: { kycId: string; reason: string }): Promise<void>;
}
