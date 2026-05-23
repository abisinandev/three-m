import { MutualFundNavDTO } from "@application/dto/mutual-funds/mutual-fund-nav-dto";
import { MutualFundNavEntity } from "@domain/entities/mutual-fund/mutual-fund-nav-entity";

export const toEntity = (dto: MutualFundNavDTO) => {
    return MutualFundNavEntity.create({
        nav: dto.nav,
        navDate: dto.navDate,
        schemeCode: dto.schemeCode,
        source: dto.source,
        interval: dto.interval,
    })
}


export const toNavResponse = (data: MutualFundNavEntity): MutualFundNavDTO => {
    return {
        id: data.id,
        schemeCode: data.schemeCode,
        nav: data.nav,
        navDate: data.navDate,
        source: data.source,
        interval: data.interval,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
    }
}