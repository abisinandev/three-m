import { NavInterval } from "@domain/enum/funds/nav-intervals.enums";
import { Document, Types } from "mongoose";

export interface MutualFundNavDocument extends Document {
  id: Types.ObjectId;

  schemeCode: string;
  nav: number;
  navDate: Date;
  source: string;
  interval: NavInterval,
  createdAt: Date;
  updatedAt: Date;
}
