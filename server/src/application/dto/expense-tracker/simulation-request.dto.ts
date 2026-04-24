import { IsEnum, IsNumber, IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ExpenseType } from './add-expense.dto';
import { ExpenseTrackerDTO } from './expense-tracker-response.dto';

export enum AdjustmentType {
    INCOME = 'INCOME',
    CATEGORY = 'CATEGORY'
}

export class SimulationAdjustmentDTO {
    @IsEnum(AdjustmentType)
    type!: AdjustmentType;

    @IsOptional()
    @IsEnum(ExpenseType)
    categoryType?: ExpenseType;

    @IsNumber()
    amount!: number; // Can be positive or negative

    @IsOptional()
    @IsString()
    description?: string;
}

export class SimulationRequestDTO {
    @IsOptional()
    @IsString()
    month?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SimulationAdjustmentDTO)
    adjustments!: SimulationAdjustmentDTO[];
}

export interface SimulationResultDTO {
    original: ExpenseTrackerDTO;
    simulated: ExpenseTrackerDTO;
    impact: {
        savingsChange: number;
        balanceChange: number;
        isBetter: boolean;
    };
}
