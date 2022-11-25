import { Types } from 'mongoose';

import { InjectModel } from 'nestjs-typegoose';
import { LikeModel } from '../schemas/likes.schema';
import { SortDirections } from 'root/@common/types/enum';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { convertToLikeDTO } from '../utils/convertToLikeDTO';
import { LikeDatabaseModel, LikeDomainModel, LikeDTO } from '../types';

export class LikesAdapter {
  constructor(@InjectModel(LikeModel) private model: ModelType<LikeModel>) {
    this.model = model;
  }

  async addLike(like: LikeDomainModel) {
    try {
      const postLike = await this.model.create({
        ...like,
        postId: new Types.ObjectId(like.entityId),
        userId: new Types.ObjectId(like.userId),
      });

      return convertToLikeDTO(postLike);
    } catch (e) {
      return null;
    }
  }

  async findLikeByQuery(query: Partial<LikeDomainModel>) {
    const filter: any = { ...query };

    if (query.entityId) {
      filter.entityId = new Types.ObjectId(query.entityId);
    }

    if (query.userId) {
      filter.userId = new Types.ObjectId(query.userId);
    }

    const doc = await this.model.findOne(filter).lean();

    return doc ? convertToLikeDTO(doc) : null;
  }

  async updateLikeById(id: string, update: Partial<LikeDatabaseModel>) {
    const doc = await this.model.findByIdAndUpdate(id, update, {
      new: true,
    });

    return doc ? convertToLikeDTO(doc) : null;
  }

  async findLikesSortedByQuery(
    query: Partial<LikeDomainModel>,
    sortBy: string,
    qty: number,
  ) {
    const filter: any = { ...query };

    if (query.entityId) {
      filter.entityId = new Types.ObjectId(query.entityId);
    }

    if (query.userId) {
      filter.userId = new Types.ObjectId(query.userId);
    }

    const docs = await this.model
      .find(filter)
      .sort({ [sortBy]: SortDirections.desc })
      .limit(qty)
      .lean();

    return docs.map(convertToLikeDTO);
  }

  async updateLikes(userId: string, update: Partial<LikeDTO>) {
    return this.model.updateMany(
      { userId: new Types.ObjectId(userId) },
      update,
    );
  }

  async removeById(id: string) {
    return this.model.findByIdAndDelete(id).lean();
  }

  async deleteAll() {
    await this.model.deleteMany({}).exec();
  }
}
