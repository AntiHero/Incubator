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
    const doc = this.collection.findOne<T>({ _id: new ObjectId(id) });

    if (!doc) return null;

    return doc;
  }

  async deleteAll() {
    await this.collection.deleteMany({});
  }

  async findByQuery(query: Record<string, any>) {
    const doc = await this.collection.findOne<T>(query);

    if (!doc) return null;

    return doc;
  }
}
