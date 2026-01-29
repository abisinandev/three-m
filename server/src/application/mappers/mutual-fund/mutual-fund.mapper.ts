import { CagrDTO } from "@application/dto/mutual-funds/mf-cagr.dto";
import { FundListDTO } from "@application/dto/mutual-funds/mutual-fund-response.dto";
import { MutualFundDTO } from "@application/dto/mutual-funds/mutual-fund.dto";
import { MutualFundEntity } from "@domain/entities/mutual-fund/mutual-fund-entity";
import { FundStatus } from "@domain/enum/funds/fund-status.enum";

export const toEntity = (dto: MutualFundDTO): MutualFundEntity => {
    return MutualFundEntity.create({
        schemeCode: dto.schemeCode,
        schemeName: dto.schemeName,
        amc: dto.amc,
        category: dto.category,
        subCategory: dto.subCategory,
        logo: dto.logo,
        risk: dto.risk,
        source: "MF_API",
        status: FundStatus.INACTIVE,
    })
}


export const toMutualFundResponse = (data: MutualFundEntity, cagr?: CagrDTO): FundListDTO => {
    return {
        id: data.id as string,
        schemeName: data.schemeName,
        schemeCode: data.schemeCode,
        amc: data.amc,
        category: data.category,
        subCategory: data.subCategory,
        logo: data.logo,
        risk: data.risk,
        status: data.status,
        nav: data.latestNav?.nav as number,
        navDate: data.latestNav?.navDate as Date,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        cagr: {
            cagr1Y: Number(cagr?.cagr1Y),
            cagr3Y: Number(cagr?.cagr3Y),
            cagr4Y: Number(cagr?.cagr5Y),
            updatedAt: cagr?.updatedAt as Date,
        },
    }
}