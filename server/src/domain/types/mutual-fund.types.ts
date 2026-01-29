export interface MfScheme {
  schemeCode: number;
  schemeName: string;
}

export interface LatestNavPoint {
  date: string;
  nav: string;
}

export interface LatestNavResponse {
  meta: {
    scheme_code: number;
    scheme_name: string;
    scheme_category: string;
    fund_house?: string;
    scheme_type?: string;
  };
  data: LatestNavPoint[];
  status: "SUCCESS" | "FAILED";
}
