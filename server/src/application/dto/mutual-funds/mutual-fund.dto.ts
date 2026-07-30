import {
    IsString,
    IsDate,
    IsOptional,
    IsEnum,
    IsNotEmpty,
    IsUrl,
} from "class-validator";
import { Type } from "class-transformer";

import { SubCategory } from "@domain/enum/funds/fund-sub-category.enum";
import { FundCategory } from "@domain/enum/funds/fund-category.enum";
import { RiskLevel } from "@domain/enum/funds/fund-risk-level.enum";

export class MutualFundDTO {
    @IsString()
    @IsNotEmpty()
    schemeCode!: string;

    @IsString()
    @IsNotEmpty()
    schemeName!: string;

    @IsString()
    @IsNotEmpty()
    amc!: string;

    @IsEnum(FundCategory, {
        message: `category must be one of: ${Object.values(FundCategory).join(", ")}`,
    })
    category!: FundCategory;

    @IsEnum(SubCategory, {
        message: `subCategory must be one of: ${Object.values(SubCategory).join(", ")}`,
    })
    subCategory!: SubCategory;

    @IsEnum(RiskLevel, {
        message: `risk must be one of: ${Object.values(RiskLevel).join(", ")}`,
    })
    risk!: RiskLevel;

    @IsString()
    @IsNotEmpty()
    status!: string;

    @IsOptional()
    @IsUrl()
    logo?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    createdAt?: Date;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    updatedAt?: Date;
}