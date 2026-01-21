import { ClientSession } from "mongoose";

export interface IBaseRepository<T> {
  create(entity: T, session?: ClientSession): Promise<void | T>;
  findById(id: string, session?: ClientSession): Promise<T | null>;
  findAll(): Promise<T[]>;
  findOne(data: Partial<T>): Promise<T | null>;
  count(): Promise<{ totalCount: number }>;
  update(id: string, update: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<void>;
}
