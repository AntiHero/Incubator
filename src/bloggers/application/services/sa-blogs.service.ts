import { Types } from 'mongoose';
import { Injectable } from '@nestjs/common';

import { InjectModel } from 'nestjs-typegoose';
import { PaginationQuery } from 'root/@core/types';
import { countSkip } from 'root/@core/utils/count-skip';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { BlogModel } from 'root/blogs/schemas/blogs.schema';
import { convertToBlogDTO } from 'root/blogs/utils/convertToBlogDTO';

@Injectable()
export class SuBlogsService {
  constructor(
    @InjectModel(BlogModel) private readonly blogModel: ModelType<BlogModel>,
  ) {}

  async findSuBlogsByPaginationQuery(userId: string, query: PaginationQuery) {
    try {
      if (!userId) return [[], 0];

      const filter = {
        name: { $regex: query.searchNameTerm },
        userId: new Types.ObjectId(userId),
      };
      const count = await this.blogModel.find(filter).count();
      const blogs = await this.blogModel
        .aggregate([
          {
            $match: filter,
          },
          {
            $sort: { [query.sortBy]: query.sortDirection },
          },
          {
            $skip: countSkip(query.pageSize, query.pageNumber),
          },
          {
            $limit: query.pageSize,
          },
        ])
        .exec();

      if (!blogs) return null;

      return [blogs.map(convertToBlogDTO), count];
    } catch (e) {
      return [[], 0];
    }
  }
}
