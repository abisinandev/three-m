import { ChangeEmailDTO } from "@application/dto/user/change-email.dto";

export interface IChangeEmailSendOtpUseCase {
    execute(userId: string, data: ChangeEmailDTO): Promise<void>
}