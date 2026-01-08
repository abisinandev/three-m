import { injectable } from "inversify";
import { BaseRepository } from "../base.repository";
import { MutualFundNavMapper } from "@infrastructure/mappers/mutual-fund/mutual-fund-nav.mapper";
import { MutualFundNavEntity } from "@domain/entities/mutual-fund/mutual-fund-nav-entity";
import { MutualFundNavDocument } from "@infrastructure/databases/mongo_db/models/interfaces/mutual-fund/mutual-fund.schema.interface";
import { IMutualFundNavRepository } from "@application/interfaces/repositories/feature/mutual-fund-nav-repository.interface";
import { MutualFundNavModel } from "@infrastructure/databases/mongo_db/models/schemas/mutual-fund/mutual-fund-nav.schema";

@injectable()
export class MutualFundNavRepsitory extends BaseRepository<MutualFundNavEntity, MutualFundNavDocument>
    implements IMutualFundNavRepository{
    constructor() {
        super(MutualFundNavModel, MutualFundNavMapper);
    }

    async findBySchemeCode(schemeCode: string): Promise<MutualFundNavEntity | null> {
        const doc = await this.model.findOne({ schemeCode }).sort({ navDate: -1 });
        if (!doc) return null;
        return this.mapper.toDomain(doc);
    }
 }