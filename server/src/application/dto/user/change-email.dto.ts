import { IsEmail, IsNotEmpty, Matches } from "class-validator";

export class ChangeEmailDTO {
    @IsEmail({}, { message: "Please provide a valid email address" })
    @IsNotEmpty({ message: "Email is required" })
    @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/, {
        message: "Email format is invalid.",
    })
    email!: string;
}

