import {
  Document,
  ObjectId,
  Collection,
  OptionalUnlessRequiredId,
} from 'mongodb';

export class Repository<T extends Document> {
  constructor(private collection: Collection<Document>) {
    this.collection = collection;
  }

  async getAll() {
    const docs = await this.collection.find<T>({}).toArray();

    return docs;
  }

  async save(inputData: OptionalUnlessRequiredId<T>) {
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
}
