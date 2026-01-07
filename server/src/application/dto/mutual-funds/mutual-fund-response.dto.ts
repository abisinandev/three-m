export interface FundListDTO {
  id: string;
  schemeCode: string;
  schemeName: string;
  amc: string;
  category: string;
  subCategory: string;
  risk: string;
  status: string;
  logo?: string;

  nav: number;
  navDate: Date;

  createdAt?: Date,
  updatedAt?: Date,
};
