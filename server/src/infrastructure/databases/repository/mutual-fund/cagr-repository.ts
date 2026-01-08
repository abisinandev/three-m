import { injectable } from "inversify";
import { BaseRepository } from "../base.repository";
import { IMfCagrRepository } from "@application/interfaces/repositories/feature/mf-cagr-repository.interface";
import { MfCagrEntity } from "@domain/entities/mutual-fund/cagr-entity";
import { MfCAGRDocument } from "@infrastructure/databases/mongo_db/models/interfaces/mutual-fund/cagr.schema.interface";
import { MfCAGRModel } from "@infrastructure/databases/mongo_db/models/schemas/mutual-fund/cagr.schema";
import { MfCagrMapper } from "@infrastructure/mappers/mutual-fund/mf-cagr-mapper";
import { CagrDTO } from "@application/dto/mutual-funds/mf-cagr.dto";

@injectable()
export class MfCagrRepository extends BaseRepository<MfCagrEntity, MfCAGRDocument> implements IMfCagrRepository {
    constructor() {
        super(MfCAGRModel, MfCagrMapper);
    }

    async upsertBySchemeCode(data: CagrDTO): Promise<void> {
        await this.model.updateOne(
            { schemeCode: data.schemeCode },
            {
                $set: {
                    cagr1Y: data.cagr1Y,
                    cagr3Y: data.cagr3Y,
                    cagr5Y: data.cagr5Y,
                    updatedAt: new Date()
                }
            },
            { upsert: true }
        );
    }
}