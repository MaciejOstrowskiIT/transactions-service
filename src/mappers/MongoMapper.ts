import { Collection } from 'mongodb';
import { DataMapper, Identifiable } from '../models/DataMapper';
import { Serializer } from './Serializer';

export class MongoMapper<Entity extends Identifiable,
DbSchema extends { _id: string }> implements DataMapper<Entity> {
  constructor(
    private collection: Collection<{_id: string}>,
    private serializer: Serializer<DbSchema, Entity>,
  ) {}

  async insert(instance: Entity) {
    await this.collection.insertOne(this.serializer.mapToDb(instance));
  }

  async update(instance: Entity) {
    await this.collection.updateOne({ _id: instance.getId() }, { $set: { ...this.serializer.mapToDb(instance) } });
  }

  async delete(id: string) {
    await this.collection.deleteOne({ _id: id });
  }

  async fetch(id: string) {
    const document = await this.collection.findOne({ _id: id });
    if (!document) {
      return null;
    }
    return this.serializer.mapToEntity(document as DbSchema);
  }

  async fetchAll() {
    const documents = await this.collection.find().toArray()
    if(!documents) {
      return null
    }
    const mappedDocuments = documents.map((document) => this.serializer.mapToEntity(document as DbSchema))
    return mappedDocuments;
  }
}
