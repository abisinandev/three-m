import { FundCategory } from "@domain/enum/funds/fund-category.enum";
import { RiskLevel } from "@domain/enum/funds/fund-risk-level.enum";
import { FundStatus } from "@domain/enum/funds/fund-status.enum";
import { SubCategory } from "@domain/enum/funds/fund-sub-category.enum";
import { LatestNav } from "@domain/types/last-nav.type";

export class MutualFundEntity {
    private readonly _id?: string;
    private readonly _schemeCode: string;
    private readonly _schemeName: string;
    private readonly _source: string;
    private readonly _amc: string;
    private readonly _category: FundCategory;
    private readonly _subCategory: SubCategory;
    private readonly _risk: RiskLevel;
    private readonly _status: FundStatus;
    private readonly _logo: string;
    private readonly _latestNav?: LatestNav;
    private readonly _createdAt?: Date;
    private readonly _updatedAt?: Date;

    private constructor(props: {
        id?: string;
        schemeCode: string;
        schemeName: string;
        source: string;
        amc: string;
        category: FundCategory;
        subCategory: SubCategory;
        risk: RiskLevel;
        status: FundStatus;
        logo: string;
        latestNav?: LatestNav;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this._id = props.id;
        this._schemeCode = props.schemeCode;
        this._schemeName = props.schemeName;
        this._source = props.source;
        this._amc = props.amc;
        this._category = props.category;
        this._subCategory = props.subCategory;
        this._risk = props.risk;
        this._status = props.status;
        this._logo = props.logo;
        this._latestNav = props.latestNav;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    };

    static create(data: {
        schemeCode: string;
        schemeName: string;
        source: string;
        amc: string;
        category: FundCategory;
        subCategory: SubCategory;
        risk: RiskLevel;
        status: FundStatus;
        logo: string;
    }): MutualFundEntity {

        if (!data.schemeCode) {
            throw new Error("Scheme code is required");
        }

        return new MutualFundEntity({
            schemeCode: data.schemeCode,
            schemeName: data.schemeName,
            source: data.source,
            amc: data.amc,
            category: data.category,
            subCategory: data.subCategory,
            risk: data.risk,
            status: data.status,
            logo: data.logo,
        })
    }

    static fromPersistance(data: {
        id: string;
        schemeCode: string;
        schemeName: string;
        source: string;
        amc: string;
        category: FundCategory;
        subCategory: SubCategory;
        risk: RiskLevel;
        status: FundStatus;
        logo: string;
        latestNav: LatestNav;
        createdAt?: Date;
        updatedAt?: Date;
    }): MutualFundEntity {
        return new MutualFundEntity({
            id: data.id,
            schemeCode: data.schemeCode,
            schemeName: data.schemeName,
            source: data.source,
            amc: data.amc,
            category: data.category,
            subCategory: data.subCategory,
            risk: data.risk,
            status: data.status,
            logo: data.logo,
            latestNav: data.latestNav,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        });
    }


    get id() { return this._id };
    get schemeCode() { return this._schemeCode };
    get schemeName() { return this._schemeName };
    get source() { return this._source };
    get amc() { return this._amc };
    get category() { return this._category };
    get subCategory() { return this._subCategory };
    get risk() { return this._risk };
    get status() { return this._status };
    get logo() { return this._logo };
    get latestNav() { return this._latestNav };
    get createdAt() { return this._createdAt };
    get updatedAt() { return this._updatedAt };

}