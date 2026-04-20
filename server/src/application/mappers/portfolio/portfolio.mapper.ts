import { PortfolioEntity } from "@domain/entities/portfolio/portfolio.entity";
import { PortfolioDTO } from "@application/dto/portfolio/portfolio.dto";

export class PortfolioMapper {
    static toDTO(entity: PortfolioEntity): PortfolioDTO {
        return {
            id: entity.id as string,
            userId: entity.userId,
            assetId: entity.assetId,
            assetType: entity.assetType,
            quantity: entity.quantity,
            units: entity.units,
            avgPrice: entity.avgPrice,
            investedAmount: entity.investedAmount,
            lockQty: entity.lockQty,
            stopLoss: entity.stopLoss,
            takeProfit: entity.takeProfit,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    static toDTOList(entities: PortfolioEntity[]): PortfolioDTO[] {
        return entities.map((entity) => this.toDTO(entity));
    }
}
