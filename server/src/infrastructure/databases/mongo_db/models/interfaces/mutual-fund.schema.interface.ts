import { Document, Types } from "mongoose";

export interface MutualFundNavDocument extends Document {
  id: Types.ObjectId;

  schemeCode: string;    
  nav: number;
  navDate: Date;
  source: string;

  createdAt: Date;
  updatedAt: Date;
}
