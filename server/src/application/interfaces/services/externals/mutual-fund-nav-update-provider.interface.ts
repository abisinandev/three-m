export interface IMutualFundNavUpdateProvider {
    fetchNavHistories(schemeCode: string): Promise<{
        schemeCode: string;
        nav: number;
        navDate: string;
    }[]>;
}