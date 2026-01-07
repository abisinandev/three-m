export interface IMutualFundNavUpdateProvider {
    fetchLatestNav(schemeCode: string): Promise<{
        schemeCode: string;
        nav: number;
        navDate: string;
    }[]>;
}