import { PortfolioEntity } from "@domain/entities/portfolio/portfolio.entity";
import { PortfolioDTO } from "@application/dto/portfolio/portfolio.dto";

export class PortfolioMapper {
    static toDTO(entity: PortfolioEntity): PortfolioDTO {
        return {
            id: entity.id as string,
            userId: entity.userId,
            symbol: entity.symbol,
            quantity: entity.quantity,
            avgPrice: entity.avgPrice,
            investedAmount: entity.investedAmount,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    static toDTOList(entities: PortfolioEntity[]): PortfolioDTO[] {
        return entities.map((entity) => this.toDTO(entity));
    }
}
