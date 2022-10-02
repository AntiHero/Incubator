import { h02, Blog } from '@/@types';

export const convertToBlog = <T extends Blog>(
  doc: T
) => ({
  id: String(doc._id),
  name: doc.name,
  youtubeUrl: doc.youtubeUrl,
  createdAt: doc.createdAt.toISOString(),
});
