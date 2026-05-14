export interface IMutualFundNavService {
    getLatestNav(schemeCode: string): Promise<{ nav: number; navDate: Date }>;
}
