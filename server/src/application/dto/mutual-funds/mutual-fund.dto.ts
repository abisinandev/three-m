import {
    IsString,
    IsDate,
    IsOptional,
} from "class-validator";
import { Type } from "class-transformer";
import { SubCategory } from "@domain/enum/funds/fund-sub-category.enum";
import { FundCategory } from "@domain/enum/funds/fund-category.enum";
import { RiskLevel } from "@domain/enum/funds/fund-risk-level.enum";

export class MutualFundDTO {
    @IsOptional()
    @IsString()
    id!: string;

    @IsString()
    schemeCode!: string;

    @IsString()
    schemeName!: string;

    @IsString()
    amc!: string;
        
    @IsString()
    category!: FundCategory;

    @IsString()
    subCategory!: SubCategory;

    @IsString()
    risk!: RiskLevel;

    @IsString()
    status!: string;

    @IsString()
    logo!: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    createdAt?: Date;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    updatedAt?: Date;
}
