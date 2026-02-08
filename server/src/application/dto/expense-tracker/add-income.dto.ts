import { IsNumber, IsString, Min } from 'class-validator';

export class AddIncomeDTO {

    @IsNumber()
    @Min(1)
    amount!: number;

    @IsString()
    source!: string;
}
