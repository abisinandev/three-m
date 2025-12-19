import { Types } from "mongoose";

export interface IBlockSchema {
    _id: Types.ObjectId;
    index: number;   
    prevHash: string;       
    txHash: string;         
    blockHash: string;       
    timestamp: number;      
    createdAt?: Date;
    updatedAt?: Date;
}