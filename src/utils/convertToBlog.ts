import { h02, Blog } from '@/@types';

export const convertToBlog = <T extends Blog>(
  doc: T
): h02.db.BlogViewModel => ({
  id: String(doc._id),
  name: doc.name,
  youtubeUrl: doc.youtubeUrl,
  createdAt: doc.createdAt.toISOString(),
});
