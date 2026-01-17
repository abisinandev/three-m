import { inject, injectable } from "inversify";
import { IMutualFundNavUpdateProvider } from "@application/interfaces/services/externals/mutual-fund-nav-update-provider.interface";
import { IHttpClient } from "@application/interfaces/services/externals/http-client-interface";
import { FEATURE_TYPES } from "@infrastructure/inversify_di/types/feature/feature.type";
import { MfApiNavResponse } from "./nav-interfaces";

@injectable()
export class NavUpdateProvider implements IMutualFundNavUpdateProvider {

    constructor(
        @inject(FEATURE_TYPES.HttpClient) private readonly httpClient: IHttpClient
    ) { }

    async fetchNavHistories(schemeCode: string): Promise<{
        schemeCode: string;
        nav: number;
        navDate: string;
    }[]> {
        const response = await this.httpClient.get<MfApiNavResponse>(
            `https://api.mfapi.in/mf/${schemeCode}`
        );
        if (!response?.data?.length) {
            throw new Error(`NAV data not found for schemeCode ${schemeCode}`);
        }

        return response.data.map(item => ({
            schemeCode,
            nav: Number(item.nav),
            navDate: this.normalizeDate(item.date),
        }));
    }

    private normalizeDate(date: string): string {
        const [dd, mm, yyyy] = date.split("-");
        return `${yyyy}-${mm}-${dd}`;
    }
}
