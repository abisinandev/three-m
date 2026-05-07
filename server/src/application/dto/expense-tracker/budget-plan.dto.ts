import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Insight } from '@domain/entities/expense-tracker/types/expense-tracker.types';

export class BudgetPlanRequestDTO {
    @IsNumber()
    income!: number;

    @IsNumber()
    needsTotal!: number;

    @IsNumber()
    wantsTotal!: number;

    @IsNumber()
    savingsTotal!: number;

    @IsOptional()
    @IsString()
    month?: string;
}

export interface BudgetPlanResultDTO {
    allocation: {
        needsPct: number;
        wantsPct: number;
        savingsPct: number;
        totalSpent: number;
        remaining: number;
    };
    health: {
        score: number;
        label: string;
        color: string;
        grade: string;
    };
    insights: Insight[];
}
