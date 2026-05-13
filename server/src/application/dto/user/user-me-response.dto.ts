import { UserDTO } from "./user-dto";
import { KycSummary } from "@domain/types/kyc-summery";
import { WalletSummary } from "@domain/types/wallet-summery";

export interface UserMeResponseDTO extends UserDTO {
  kyc?: KycSummary;
  wallet?: WalletSummary;
}
