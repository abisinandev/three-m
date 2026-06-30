import { StockEntity } from "@domain/entities/stock/stock.entity";
import { StockDTO } from "@application/dto/stocks/stock.dto";

export const StockMapper = {
    toDTO: (entity: StockEntity): StockDTO => {
        return {
            symbol: entity.symbol,
            name: entity.name,
            exchange: entity.exchange,
            logo: entity.logo,
            sector: entity.sector,
            isTradable: entity.isTradable,
            isVisible: entity.isVisible,
        };
    },

    toDTOList: (entities: StockEntity[]): StockDTO[] => {
        return entities.map((entity) => StockMapper.toDTO(entity));
    }
}