import { Repository } from 'typeorm';
import { BlogDomainModel } from '../types';
import { Injectable } from '@nestjs/common';
import { Blog } from '../entity/blog.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'root/posts/entity/post.entity';
import { ConvertBlogData } from '../utils/convertToBlog';
import { convertToBlogDTO } from '../utils/convertToBlogDTO';
import { Comment } from 'root/comments/entity/comment.entity';
import { CommentLike, PostLike } from 'root/likes/entity/like.entity';

@Injectable()
export class BlogsAdapter {
  constructor(
    @InjectRepository(Blog)
    private readonly blogsRepository: Repository<Blog>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(PostLike)
    private readonly postLikeRepository: Repository<PostLike>,
    @InjectRepository(CommentLike)
    private readonly commentLikeRepository: Repository<CommentLike>,
  ) {}

  async addBlog(blog: Partial<BlogDomainModel>) {
    try {
      const { name, description, websiteUrl, userId } = blog;

      const createdBlog = await this.blogsRepository.query(
        `
          INSERT INTO blogs (name, description, websiteUrl, userId) VALUES ($1, $2, $3, $4)
            RETURNING *
        `,
        [name, description, websiteUrl, userId],
      );

      return ConvertBlogData.toDTO(createdBlog);
    } catch (error) {
      console.error(error);

      return null;
    }
  }
}

// @Injectable()
// export class BlogsAdapter {
//   constructor(
//     @InjectModel(BlogModel)
//     private model: mongoose.Model<BlogModel>,
//     @InjectModel(PostModel)
//     private postModel: mongoose.Model<PostModel>,
//     @InjectModel(CommentModel)
//     private commentModel: mongoose.Model<CommentModel>,
//     @InjectModel(LikeModel)
//     private likeModel: mongoose.Model<LikeModel>,
//   ) {}

//   async getAllBlogs() {
//     try {
//       const blogs = await this.model.find({}).lean();
//       return blogs.map(convertToBlogDTO);
//     } catch (e) {
//       return null;
//     }
//   }

//   async addBlog(blog: BlogDomainModel) {
//     try {
//       const createdBlog = await this.model.create(blog);
//       return convertToBlogDTO(createdBlog);
//     } catch (e) {
//       console.error(e);

//       return null;
//     }
//   }

//   async findBlogById(id: string, forUser?: Roles) {
//     try {
//       const blog = await this.model.findById(id).lean();

//       if (forUser === Roles.USER) {
//         if (blog.banInfo.isBanned) return null;
//       }

//       return convertToBlogDTO(blog);
//     } catch (e) {
//       return null;
//     }
//   }

//   async findBlogByIdAndUpdate(id: string, updates: Partial<BlogDomainModel>) {
//     try {
//       const blog = await this.model
//         .findByIdAndUpdate(id, updates, { new: true })
//         .lean();

//       if (!blog) return null;

//       return convertToBlogDTO(blog);
//     } catch (e) {
//       console.error(e);

//       return null;
//     }
//   }

//   async findBlogByIdAndDelete(id: string) {
//     await this.likeModel.deleteMany({ entityId: toObjectId(id) }).exec();
//     await this.commentModel.deleteMany({ entityId: toObjectId(id) }).exec();
//     await this.postModel.deleteMany({ blogId: toObjectId(id) });

//     const blog = await this.model.findByIdAndDelete(id).lean().exec();

//     if (!blog) return null;

//     return convertToBlogDTO(blog);
//   }

//   async deleteAllBlogs() {
//     await this.likeModel.deleteMany({}).exec();
//     await this.commentModel.deleteMany({}).exec();
//     await this.postModel.deleteMany({}).exec();
//     await this.model.deleteMany({}).exec();
//   }

//   async countBlogPosts(id: string) {
//     const blog = await this.model.findById(id).populate('posts').lean();

//     if (!blog) return null;

//     return blog.posts.length;
//   }

//   async findBlogPostsByQuery(
//     id: string,
//     query: PaginationQuery,
//     userId = '',
//   ): Promise<[PostExtendedLikesDTO[], number]> {
//     try {
//       const count = (await this.model.findById(id))?.posts.length ?? 0;

//       const posts = await this.model
//         .aggregate([
//           { $match: { _id: toObjectId(id) } },
//           {
//             $lookup: {
//               from: 'posts',
//               localField: 'posts',
//               foreignField: '_id',
//               as: 'blogPosts',
//             },
//           },
//           {
//             $project: { blogPosts: 1 },
//           },
//           {
//             $unwind: '$blogPosts',
//           },
//           {
//             $replaceRoot: {
//               newRoot: { $mergeObjects: ['$$ROOT', '$blogPosts'] },
//             },
//           },
//           {
//             $project: { blogPosts: 0 },
//           },
//           {
//             $sort: { [query.sortBy]: query.sortDirection },
//           },
//           {
//             $skip: countSkip(query.pageSize, query.pageNumber),
//           },
//           {
//             $limit: query.pageSize,
//           },
//         ])
//         .exec();

//       if (!posts) return null;

//       await this.likeModel.populate(posts, { path: 'likes' });

//       const result: PostExtendedLikesDTO[] = [];

//       for (const post of posts) {
//         const likesCount = post.likes.filter((like) => {
//           if (like instanceof Types.ObjectId) throw new Error('Not populated');

//           return like.likeStatus === LikeStatuses.Like;
//         }).length;

//         const dislikesCount = post.likes.filter((like) => {
//           if (like instanceof Types.ObjectId) throw new Error('Not populated');

//           return like.likeStatus === LikeStatuses.Dislike;
//         }).length;

//         let userStatus: LikeStatuses;

//         const status = post.likes.find((like) => {
//           if (like instanceof Types.ObjectId) throw new Error('Not populated');

//           return String(like.userId) === userId;
//         });

//         if (status && 'likeStatus' in status) {
//           userStatus = status.likeStatus;
//         } else {
//           userStatus = LikeStatuses.None;
//         }

//         const convertedPost = convertToPostDTO(post);

//         const newestLikes = post.likes
//           .filter((like) => {
//             if (like instanceof Types.ObjectId)
//               throw new Error('Not populated');

//             return like.likeStatus === LikeStatuses.Like;
//           })
//           .sort((a, b) => {
//             if (a instanceof Types.ObjectId || b instanceof Types.ObjectId)
//               throw new Error('Not populated');

//             return (
//               new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//             );
//           });

//         newestLikes.splice(LIKES_LIMIT);

//         const extendedPost: PostExtendedLikesDTO = {
//           ...convertedPost,
//           likesCount,
//           dislikesCount,
//           userStatus,
//           newestLikes: newestLikes.map(convertToLikeDTO),
//         };

//         result.push(extendedPost);
//       }

//       return [result, count];
//     } catch (e) {
//       console.error(e);

//       return null;
//     }
//   }

//   async findBlogsByQuery(
//     query: PaginationQuery,
//     forRole?: Roles,
//   ): Promise<[BlogDTO[], number]> {
//     try {
//       let filter = {};

//       if (forRole === Roles.USER) {
//         filter = {
//           name: { $regex: query.searchNameTerm },
//           'banInfo.isBanned': false,
//         };
//       } else {
//         filter = {
//           name: { $regex: query.searchNameTerm },
//         };
//       }

//       const count = await this.model.find(filter).count();
//       const blogs = await this.model
//         .aggregate([
//           {
//             $match: filter,
//           },
//           {
//             $sort: { [query.sortBy]: query.sortDirection },
//           },
//           {
//             $skip: countSkip(query.pageSize, query.pageNumber),
//           },
//           {
//             $limit: query.pageSize,
//           },
//         ])
//         .exec();

//       if (!blogs) return null;

//       return [blogs.map(convertToBlogDTO), count];
//     } catch (e) {
//       return null;
//     }
//   }

//   async findUserBlogsByQuery(
//     userId: string,
//     query: PaginationQuery,
//   ): Promise<[BlogDTO[], number]> {
//     try {
//       if (!userId) return [[], 0];

//       const filter = {
//         name: { $regex: query.searchNameTerm },
//         userId: new Types.ObjectId(userId),
//       };
//       const count = await this.model.find(filter).count();
//       const blogs = await this.model
//         .aggregate([
//           {
//             $match: filter,
//           },
//           {
//             $sort: { [query.sortBy]: query.sortDirection },
//           },
//           {
//             $skip: countSkip(query.pageSize, query.pageNumber),
//           },
//           {
//             $limit: query.pageSize,
//           },
//         ])
//         .exec();

//       if (!blogs) return null;

//       return [blogs.map(convertToBlogDTO), count];
//     } catch (e) {
//       return [[], 0];
//     }
//   }

//   async addBlogPost(id: string, post: PostDomainModel) {
//     const createdPost = await this.postModel.create({
//       ...post,
//       blogId: new Types.ObjectId(post.blogId),
//     });

//     const blog = await this.model.findByIdAndUpdate(id, {
//       $push: { posts: createdPost._id },
//     });

//     if (!blog) return null;

//     const convertedPost = convertToPostDTO(createdPost);

//     const extendedPost: PostExtendedLikesDTO = {
//       ...convertedPost,
//       likesCount: 0,
//       dislikesCount: 0,
//       userStatus: LikeStatuses.None,
//       newestLikes: [],
//     };

//     return extendedPost;
//   }

//   async banBlog(id: string, banStatus: boolean) {
//     try {
//       return this.model.findByIdAndUpdate(id, {
//         'banInfo.isBanned': banStatus,
//         'banInfo.banDate': banStatus ? new Date() : null,
//       });
//     } catch (error) {
//       console.error(error);

//       return null;
//     }
//   }

//   async getAllComments(
//     userId: string,
//     query: PaginationQuery,
//   ): Promise<[BloggerCommentDTO[], number]> {
//     let count = 0;

//     (
//       await this.model
//         .find({ userId: new Types.ObjectId(userId) })
//         .populate('posts')
//     ).forEach((blog) => {
//       blog.posts.forEach((post) => {
//         if (!(post instanceof Types.ObjectId)) {
//           count += post.comments.length;
//         }
//       });
//     });

//     const comments = await this.model
//       .aggregate([
//         {
//           $match: {
//             userId: new Types.ObjectId(userId),
//           },
//         },
//         {
//           $lookup: {
//             from: 'posts',
//             localField: 'posts',
//             foreignField: '_id',
//             as: 'blogPosts',
//           },
//         },
//         {
//           $project: { blogPosts: 1 },
//         },
//         {
//           $unwind: '$blogPosts',
//         },
//         {
//           $replaceRoot: {
//             newRoot: { $mergeObjects: ['$$ROOT', '$blogPosts'] },
//           },
//         },
//         {
//           $lookup: {
//             from: 'comments',
//             localField: 'comments',
//             foreignField: '_id',
//             as: 'postsComments',
//           },
//         },
//         {
//           $project: {
//             postsComments: 1,
//             blogId: 1,
//             blogName: 1,
//             postId: '$_id',
//             title: 1,
//           },
//         },
//         {
//           $unwind: '$postsComments',
//         },
//         {
//           $replaceRoot: {
//             newRoot: { $mergeObjects: ['$$ROOT', '$postsComments'] },
//           },
//         },
//         {
//           $project: { postsComments: 0 },
//         },
//         {
//           $sort: { [query.sortBy]: query.sortDirection },
//         },
//         {
//           $skip: countSkip(query.pageSize, query.pageNumber),
//         },
//         {
//           $limit: query.pageSize,
//         },
//         {
//           $lookup: {
//             from: 'likes',
//             localField: 'likes',
//             foreignField: '_id',
//             as: 'commentsLikes',
//           },
//         },
//       ])
//       .exec();

//     return [comments.map(convertToBloggerCommentDTO), count];
//   }
// }
