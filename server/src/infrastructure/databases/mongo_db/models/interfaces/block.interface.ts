export interface IBlockSchema {
    _id: string;
    index: number;   
    prevHash: string;       
    txHash: string;         
    blockHash: string;       
    timestamp: number;      
    // createdAt?: Date;
    // updatedAt?: Date;
}