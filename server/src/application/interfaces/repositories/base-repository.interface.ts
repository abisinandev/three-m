import { ClientSession } from "mongoose";

export interface IBaseRepository<T> {
  create(entity: T, session?: ClientSession): Promise<void | T>;
  findById(id: string, session?: ClientSession): Promise<T | null>;
  findAll(session?: ClientSession): Promise<T[]>;
  findOne(data: Partial<T>, session?: ClientSession): Promise<T | null>;
  count(session?: ClientSession): Promise<{ totalCount: number }>;
  update(
    id: string,
    update: Partial<T>,
    session?: ClientSession
  ): Promise<T | null>;
  delete(id: string, session?: ClientSession): Promise<void>;
}
