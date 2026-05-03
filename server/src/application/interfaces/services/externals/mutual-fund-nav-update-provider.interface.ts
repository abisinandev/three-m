export interface MfApiNavItem {
    date: string;
    nav: string;
}

export interface MfApiNavResponse {
    meta: {
        scheme_code: string;
        scheme_name: string;
    };
    data: MfApiNavItem[];
}

export interface ParsedNav {
    date: Date;
    nav: number;
}

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