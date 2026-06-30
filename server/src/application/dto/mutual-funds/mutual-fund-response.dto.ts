import { MutualFundNavDTO } from "./mutual-fund-nav-dto";

export interface FundListDTO {
  // id: string;
  schemeCode: string;
  schemeName: string;
  amc: string;
  category: string;
  subCategory: string;
  risk: string;
  status: string;
  logo?: string;
  cagr: {
    cagr1Y: number,
    cagr3Y: number,
    cagr4Y: number,
    updatedAt: Date,
  }
  nav: number;
  navDate: Date;
  latestNav?: {
    nav: number;
    navDate: Date;
  };

  createdAt?: Date,
  updatedAt?: Date,
  navHistory?:MutualFundNavDTO[],
};
