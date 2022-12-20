import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CommentLike, PostLike } from '../entity/like.entity';

@Injectable()
export class LikeQueryRepository {
  constructor(
    @InjectRepository(PostLike)
    private readonly postsLikesRepository: Repository<PostLike>,
    @InjectRepository(CommentLike)
    private readonly commentLikesRepository: Repository<CommentLike>,
  ) {}
}

//   async findLikeByQuery(query: Partial<LikeDomainModel>) {
//     const filter: any = { ...query };

//     if (query.entityId) {
//       filter.entityId = new Types.ObjectId(query.entityId);
//     }

//     if (query.userId) {
//       filter.userId = new Types.ObjectId(query.userId);
//     }

//     const doc = await this.model.findOne(filter).lean();

//     return doc ? convertToLikeDTO(doc) : null;
//   }

//   async updateLikeById(id: string, update: Partial<LikeDatabaseModel>) {
//     const doc = await this.model.findByIdAndUpdate(id, update, {
//       new: true,
//     });

//     return doc ? convertToLikeDTO(doc) : null;
//   }

//   async findLikesSortedByQuery(
//     query: Partial<LikeDomainModel>,
//     sortBy: string,
//     qty: number,
//   ) {
//     const filter: any = { ...query };

//     if (query.entityId) {
//       filter.entityId = new Types.ObjectId(query.entityId);
//     }

//     if (query.userId) {
//       filter.userId = new Types.ObjectId(query.userId);
//     }

//     const docs = await this.model
//       .find(filter)
//       .sort({ [sortBy]: SortDirections.desc })
//       .limit(qty)
//       .lean();

//     return docs.map(convertToLikeDTO);
//   }

//   async updateLikes(userId: string, update: Partial<LikeDTO>) {
//     return this.model.updateMany(
//       // { userId: new Types.ObjectId(userId) },
//       { userId },
//       update,
//     );
//   }

//   async removeById(id: string) {
//     return this.model.findByIdAndDelete(id).lean();
//   }

//   async deleteAll() {
//     await this.model.deleteMany({}).exec();
//   }
// }
