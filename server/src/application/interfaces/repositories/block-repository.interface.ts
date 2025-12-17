import { BlockEntity } from "@domain/entities/block.entity";
import { IBaseRepository } from "./base-repository.interface";

export interface IBlockRepository extends IBaseRepository<BlockEntity>{
    getLastBlock():Promise<BlockEntity | null>
}