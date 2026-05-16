import { IBaseRepository } from "@application/interfaces/repositories/base-repository.interface";
import type { ClientSession, Model, UpdateQuery } from "mongoose";

export abstract class BaseRepository<TDomain, TDocument>
  implements IBaseRepository<TDomain> {
  constructor(
    protected readonly model: Model<TDocument>,
    protected readonly mapper: {
      toDomain(doc: TDocument): TDomain;
      toPersistance(domain: TDomain): Partial<TDocument>;
    },
  ) { }

  async create(entity: TDomain, session?: ClientSession): Promise<void> {
    const data = this.mapper.toPersistance(entity);
    if (session) {
      await this.model.create([data], { session });
    } else {
      await this.model.create(data);
    }
  }

  async findById(id: string, _session?: ClientSession): Promise<TDomain | null> {
    const doc = await this.model.findById(id).exec();
    return doc ? this.mapper.toDomain(doc) : null;
  }

  async findOne(data: Partial<TDomain>, session?: ClientSession): Promise<TDomain | null> {

    const query = this.model.findOne(data as unknown as import("mongoose").FilterQuery<TDocument>);
    if (session) query.session(session);

    const doc = await query.exec();
    return doc ? this.mapper.toDomain(doc) : null;
  }

  async findAll(session?: ClientSession): Promise<TDomain[]> {
    const query = this.model.find().sort({ createdAt: -1 });
    if (session) query.session(session);

    const docs = await query.exec();
    return Promise.all(docs.map((doc) => this.mapper.toDomain(doc)));
  }

  async count(session?: ClientSession): Promise<{ totalCount: number }> {
    const query = this.model.countDocuments();
    if (session) query.session(session);

    const totalCount = await query.exec();
    return { totalCount };
  }

  async update(id: string, update: Partial<TDomain>, session?: ClientSession): Promise<TDomain | null> {

    const mappedUpdate = this.mapper.toPersistance(update as TDomain);
    const updateQuery: UpdateQuery<TDocument> = {
      $set: mappedUpdate,
    };

    const doc = await this.model.findByIdAndUpdate(
      id,
      updateQuery,
      {
        new: true,
        session,
      }
    );

    return doc ? this.mapper.toDomain(doc) : null;
  }

  async delete(id: string, session?: ClientSession): Promise<void> {
    await this.model.findByIdAndDelete(id, { session });
  }
}
