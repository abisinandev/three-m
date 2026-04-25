import { StockEntity } from "@domain/entities/stock/stock.entity";
import { StockDTO } from "@application/dto/stocks/stock.dto";

export class StockMapper {
    static toDTO(entity: StockEntity): StockDTO {
        return {
            id: entity.id as string,
            symbol: entity.symbol,
            name: entity.name,
            exchange: entity.exchange,
            logo: entity.logo,
            sector: entity.sector,
            isTradable: entity.isTradable,
            isVisible: entity.isVisible,
        };
    }

    static toDTOList(entities: StockEntity[]): StockDTO[] {
        return entities.map((entity) => this.toDTO(entity));
    }
}