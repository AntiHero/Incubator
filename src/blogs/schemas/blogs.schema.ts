import mongoose, { Schema } from 'mongoose';
import { BlogDatabaseModel } from 'root/blogs/types';

export const blogsSchema = new mongoose.Schema<BlogDatabaseModel>(
  {
    name: {
      type: String,
      required: true,
      max: 15,
    },
    youtubeUrl: {
      type: String,
      required: true,
      max: 100,
      validate:
        /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
    },
    posts: {
      type: [Schema.Types.ObjectId],
      ref: 'post',
      default: [],
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

blogsSchema.post('remove', removeLinkedDocuments);

async function removeLinkedDocuments(doc: BlogDatabaseModel) {
  for (const post of doc.posts) await post.remove();
}

export const BlogsModel = mongoose.model('blog', blogsSchema);
