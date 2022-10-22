import { Document, ObjectId, Collection } from 'mongodb';

export class Repository<T extends Document> {
  constructor(protected collection: Collection<Document>) {
    this.collection = collection;
  }

  async getAll() {
    const docs = await this.collection.find<T>({}).toArray();

    return docs;
  }

  async save(inputData: any) {
    await this.collection.insertOne(inputData);

    return inputData;
  }

  async findById(id: string) {
    const doc = await this.collection.findOne<T>({ _id: new ObjectId(id) });

    if (!doc) return null;

    return doc;
  }

  async deleteAll() {
    await this.collection.deleteMany({});
  }

  async findOneByQuery(query: Record<string, any>) {
    const doc = await this.collection.findOne<T>(query);

    if (!doc) return null;

    return doc;
  }

  async findAllByQuery(query: Record<string, any>) {
    const docs = await this.collection.find<T>(query).toArray();

    return docs;
  }

  async deleteById(id: string) {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) return true;

    return null;
  }

  async deleteOneByQuery(query: Record<string, any>) {
    const result = await this.collection.deleteOne(query);

    if (result.deletedCount === 1) return true;

    return null;
  }

  async updateOne(filter: Record<string, any>, update: Record<string, any>) {
    const result = await this.collection.updateOne(filter, { $set: update });

    if (result.modifiedCount === 1) return true;

    return null;
  }
}
