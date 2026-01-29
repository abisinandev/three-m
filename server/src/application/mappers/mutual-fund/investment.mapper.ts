import { InvestmentDTO } from '@application/dto/mutual-funds/investment-dto';
import { InvestmentResponseDTO } from '@application/dto/mutual-funds/investment-response.dto';
import { InvestmentEntity } from '@domain/entities/mutual-fund/investment.entity';
import { MutualFundEntity } from '@domain/entities/mutual-fund/mutual-fund-entity';

/**
 * DTO → Domain Entity
 */
export const toInvestmentEntity = (
    dto: InvestmentDTO,
    userId: string,
): InvestmentEntity => {
    return InvestmentEntity.create({
        schemeCode: dto.schemeCode,
        amount: dto.amount,
        investmentType: dto.investmentType,
        paymentMethod: dto.paymentMethod,
        userId,
    });
};

/**
 * Domain Entity → Response DTO
 */
export const toInvestmentResponse = (
    entity: InvestmentEntity,
    fund: MutualFundEntity,
    profit: number,
    xirr?: number,
): InvestmentResponseDTO => {

    return {
        schemeCode: entity.schemeCode,
        amount: entity.amount,
        units: entity.units as number,
        navDate: entity.navDate as Date,
        paymentMethod: entity.paymentMethod,
        investmentType: entity.investmentType,
        createdAt: entity.createdAt,
        status: entity.status,
        userId: entity.userId,
        id: entity.id,
        nav: entity.nav,
        updatedAt: entity.navDate,
        schemeName: fund?.schemeName as string,
        category: fund?.category as string,
        logo: fund.logo,
        remainingUnits: entity.remainingUnits,
        redeemedUnits: entity.redeemedUnits,
        redeemedAmount: entity.redeemedAmount,
        redeemedAt: entity.redeemedAt,
        profit,
        xirr,
    };
};
