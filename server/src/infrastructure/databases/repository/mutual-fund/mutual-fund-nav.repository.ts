import { injectable } from "inversify";
import { BaseRepository } from "../base.repository";
import { MutualFundNavMapper } from "@infrastructure/mappers/mutual-fund/mutual-fund-nav.mapper";
import { MutualFundNavEntity } from "@domain/entities/mutual-fund/mutual-fund-nav-entity";
import { MutualFundNavDocument } from "@infrastructure/databases/mongo_db/models/interfaces/mutual-fund/mutual-fund.schema.interface";
import { IMutualFundNavRepository } from "@application/interfaces/repositories/feature/mutual-fund-nav-repository.interface";
import { MutualFundNavModel } from "@infrastructure/databases/mongo_db/models/schemas/mutual-fund/mutual-fund-nav.schema";
import { MutualFundNavDTO } from "@application/dto/mutual-funds/mutual-fund-nav-dto";
import { NavInterval } from "@domain/enum/funds/nav-intervals.enums";
import { NavHistoryDTO } from "@application/dto/mutual-funds/nav-histroy.dto";

@injectable()
export class MutualFundNavRepsitory extends BaseRepository<MutualFundNavEntity, MutualFundNavDocument>
    implements IMutualFundNavRepository {
    constructor() {
        super(MutualFundNavModel, MutualFundNavMapper);
    }

    async findBySchemeCode(schemeCode: string): Promise<MutualFundNavEntity | null> {
        const doc = await this.model.findOne({ schemeCode }).sort({ navDate: -1 });
        if (!doc) return null;
        return this.mapper.toDomain(doc);
    };

    async upsertDocument(entity: MutualFundNavDTO): Promise<void> {
        await this.model.updateOne(
            {
                schemeCode: entity.schemeCode,
                navDate: entity.navDate,
                interval: entity.interval,
            },
            {
                $set: {
                    nav: entity.nav,
                    source: entity.source,
                    updatedAt: new Date(),
                },
                $setOnInsert: {
                    createdAt: new Date(),
                },
            },
            { upsert: true }
        );
    };

    async findByInterval(schemeCode: string, interval: NavInterval, limit = 300): Promise<MutualFundNavEntity[] | null> {
        const _docs = null;
        if (interval === NavInterval.DAILY) {
            const docs = await this.model
                .find({ schemeCode, interval: NavInterval.DAILY })
                .sort({ navDate: -1 })
                .limit(limit)
                .exec();

            return docs.map(doc => this.mapper.toDomain(doc));
        }

        if (interval === NavInterval.WEEKLY) {
            const docs = await this.model.aggregate([
                { $match: { schemeCode, interval: NavInterval.DAILY } },

                {
                    $group: {
                        _id: {
                            year: { $year: "$navDate" },
                            week: { $isoWeek: "$navDate" },
                        },
                        navDate: { $max: "$navDate" },
                        nav: { $last: "$nav" },
                    },
                },

                { $sort: { navDate: -1 } },
                { $limit: limit },
            ]);

            return docs.map(doc => this.mapper.toDomain(doc));
        }

        if (interval === NavInterval.MONTHLY) {
            const docs = await this.model.aggregate([
                { $match: { schemeCode, interval: NavInterval.DAILY } },

                {
                    $group: {
                        _id: {
                            year: { $year: "$navDate" },
                            month: { $month: "$navDate" },
                        },
                        navDate: { $max: "$navDate" },
                        nav: { $last: "$nav" },
                    },
                },

                { $sort: { navDate: -1 } },
                { $limit: limit },
            ]);

            return docs.map(doc => this.mapper.toDomain(doc));
        }

        if (interval === NavInterval.YEARLY) {
            const docs = await this.model.aggregate([
                { $match: { schemeCode, interval: NavInterval.DAILY } },

                {
                    $group: {
                        _id: {
                            year: { $year: "$navDate" },
                        },
                        navDate: { $max: "$navDate" },
                        nav: { $last: "$nav" },
                    },
                },

                { $sort: { navDate: -1 } },
                { $limit: limit },
            ]);

            return docs.map(doc => this.mapper.toDomain(doc));
        }
        return null;
    };


    async getLatestNav(schemeCode: string): Promise<MutualFundNavEntity | null> {
        const doc = await this.model
            .findOne({ schemeCode })
            .sort({ navDate: -1 })
            .exec()
        if (!doc) return null
        return this.mapper.toDomain(doc)
    }


    async bulkUpsertNavs(navs: NavHistoryDTO[]): Promise<void> {
        if (!navs.length) return;

        const operations = navs.map(nav => ({
            updateOne: {
                filter: {
                    schemeCode: nav.schemeCode,
                    navDate: nav.navDate,
                },
                update: {
                    $set: {
                        nav: nav.nav,
                        interval: nav.interval,
                        source: nav.source,
                    },
                },
                upsert: true,
            },
        }));
        await this.model.bulkWrite(operations, { ordered: false });
    }
}