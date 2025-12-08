import type { IBaseRepository } from "@application/interfaces/repositories/base-repository.interface";
import type { Model, UpdateQuery } from "mongoose";

export abstract class BaseRepository<TDomain, TDocument>
  implements IBaseRepository<TDomain> {
  constructor(
    protected readonly model: Model<TDocument>,
    protected readonly mapper: {
      toDomain(doc: TDocument): TDomain;
      toPersistance(domain: TDomain): Partial<TDocument>;
    },
  ) { }

  async create(entity: TDomain): Promise<void> {
    const data = await this.mapper.toPersistance(entity);
    await this.model.create(data);
  }

  async findById(id: string): Promise<TDomain | null> {
    const doc = await this.model.findById(id).exec();
    return doc ? this.mapper.toDomain(doc) : null;
  }

  async findOne(data: Partial<TDomain>): Promise<TDomain | null> {
    const doc = await this.model.findOne(data).exec();
    return doc ? this.mapper.toDomain(doc) : null;
  }

  async findAll(): Promise<TDomain[]> {
    const docs = await this.model.find().sort({ createdAt: -1 }).exec();
    return Promise.all(docs.map((doc) => this.mapper.toDomain(doc)));
  }

  async count(): Promise<{ totalCount: number }> {
    const totalCount = await this.model.countDocuments();
    return { totalCount };
  }

  async update(id: string, update: Partial<TDomain>): Promise<TDomain | null> {
    const mappedUpdate = this.mapper.toPersistance(update as TDomain);

    const updateQuery: UpdateQuery<TDocument> = {
      $set: mappedUpdate,
    };

    const doc = await this.model.findByIdAndUpdate(id, updateQuery, {
      new: true,
    });

    return doc ? this.mapper.toDomain(doc) : null;
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id);
  }
}
