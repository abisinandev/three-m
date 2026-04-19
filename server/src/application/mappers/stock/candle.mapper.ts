import { CandleEntity } from "@domain/entities/stock/candle.entity";
import { CandleDTO, CandlesResponseDTO } from "@application/dto/stocks/candle.dto";
import { ICandle } from "@infrastructure/databases/mongo_db/models/interfaces/stocks/stock-candle-schema.interface";

export class CandleMapper {
    static toEntity(data: ICandle): CandleEntity {
        return CandleEntity.create({
            symbol: data.symbol,
            timeframe: data.timeframe,
            time: data.time,
            open: data.open,
            high: data.high,
            low: data.low,
            close: data.close,
            volume: data.volume,
        });
    }

    static toEntityList(data: ICandle[]): CandleEntity[] {
        return data.map((item) => this.toEntity(item));
    }

    static toDTO(entity: CandleEntity): CandleDTO {
        return {
            symbol: entity.symbol,
            timeframe: entity.timeframe,
            time: entity.time,
            open: entity.open,
            high: entity.high,
            low: entity.low,
            close: entity.close,
            volume: entity.volume,
        };
    }

    static toDTOList(entities: CandleEntity[]): CandleDTO[] {
        return entities.map((entity) => this.toDTO(entity));
    }

    static toResponse(entities: CandleEntity[]): CandlesResponseDTO {
        if (entities.length === 0) {
            return {
                s: "no_data",
                t: [],
                o: [],
                h: [],
                l: [],
                c: [],
                v: [],
            };
        }

        return {
            s: "ok",
            t: entities.map((e) => e.time),
            o: entities.map((e) => e.open),
            h: entities.map((e) => e.high),
            l: entities.map((e) => e.low),
            c: entities.map((e) => e.close),
            v: entities.map((e) => e.volume),
        };
    }
}
