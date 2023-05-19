import { ImageType } from 'root/@core/types/enum';
import { BlogDTO, BlogViewModel } from '../types';

export const convertToBlogViewModel = (blog: BlogDTO): BlogViewModel => {
  const {
    id,
    name,
    websiteUrl,
    description,
    subscribersCount,
    currentUserSubscriptionStatus,
    createdAt,
    isMembership,
    images = [],
  } = blog;

  const result: BlogViewModel = {
    id,
    name,
    websiteUrl,
    subscribersCount,
    currentUserSubscriptionStatus,
    description,
    createdAt,
    isMembership,
  };

  const noImage = {
    type: null,
    fileSize: null,
    height: null,
    width: null,
    url: null,
  };

  const { type: _, ...wallpaper } =
    images.find((img) => <any>img?.type === ImageType.wallpaper) ?? noImage;

  const { type: __, ...main } =
    images.find((img) => <any>img?.type === ImageType.main) ?? noImage;

  blog.images &&
    (result.images = {
      wallpaper,
      main: [main],
    });

  return result;
};
