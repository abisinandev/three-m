export interface IVerifyKycUseCase {
  execute(kycId: string): Promise<void>;
}
