import { BlockEntity } from "@domain/entities/block.entity";
import { IBaseRepository } from "./base-repository.interface";
import { ClientSession } from "mongoose";

export interface IBlockRepository extends IBaseRepository<BlockEntity>{
    getLastBlock(session: ClientSession):Promise<BlockEntity | null>
}