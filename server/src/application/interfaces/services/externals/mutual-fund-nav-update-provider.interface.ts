export interface IMutualFundNavUpdateProvider {
    fetchNavHistories(schemeCode: string): Promise<{
        schemeCode: string;
        nav: number;
        navDate: string;
    }[]>;

    fetchNavSince(schemeCode: string, lastNavDate: Date): Promise<{
        schemeCode: string;
        nav: number;
        navDate: string;
    }[]>;
}