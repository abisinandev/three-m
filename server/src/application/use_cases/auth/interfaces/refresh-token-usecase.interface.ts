import type { RefreshDTO } from "@application/dto/auth/refresh.dto";
import type { RefreshResponseDTO } from "@application/dto/auth/refresh-response.dto";

export interface IRefreshTokenUseCase {
  execute(data: RefreshDTO): Promise<RefreshResponseDTO>;
}
