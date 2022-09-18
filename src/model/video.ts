import { errors } from '../errors';
import { h01 } from '../@types';
import { addOneDay } from '../utils/addOneDay';
import { generateId } from '../utils/idGenerator';
import {
  Boolean,
  Enum,
  Format,
  Max,
  MaxLength,
  Min,
  NullableNumber,
  Number,
  String,
  Validate,
} from '../utils/decorators';

export const resolutions = {
  P144: 'P144',
  P240: 'P240',
  P360: 'P360',
  P480: 'P480',
  P720: 'P720',
  P1080: 'P1080',
  P1440: 'P1440',
  P2160: 'P2160',
} as const;

export class Video implements h01.Video {
  public id: number;

  public title: string | null = null;

  public author: string | null = null;

  public canBeDownloaded = false;

  public minAgeRestriction: number | null = null;

  public createdAt = new Date().toISOString();

  public publicationDate = addOneDay(this.createdAt);

  public availableResolutions: h01.Resolutions[keyof h01.Resolutions][] = [];

  constructor () {
    this.id = generateId();
  }

  @Validate({ errors })
  create (
    @MaxLength(40)
    @String()
    title: h01.CreateVideoInputModel['title'],
    @MaxLength(20)
    @String()
    author: h01.CreateVideoInputModel['author'],
    @Enum({ collection: resolutions })
    availableResolutions: h01.CreateVideoInputModel['availableResolutions']
  ): h01.Video {
    this.title = title;
    this.author = author;
    this.availableResolutions = availableResolutions;

    const video: h01.Video = {
      id: this.id,
      author: this.author,
      title: this.title,
      canBeDownloaded: this.canBeDownloaded,
      minAgeRestriction: this.minAgeRestriction,
      createdAt: this.createdAt,
      publicationDate: this.publicationDate,
      availableResolutions: this.availableResolutions,
    };

    return video;
  }

  @Validate({ errors })
  update (
    @Number()
    id: number,
    @MaxLength(40)
    @String()
    title?: h01.UpdateVideoInputModel['title'],
    @MaxLength(20)
    @String()
    author?: h01.UpdateVideoInputModel['author'],
    @Enum({ collection: resolutions })
    availableResolutions?: h01.UpdateVideoInputModel['availableResolutions'],
    @Boolean()
    canBeDownloaded?: h01.UpdateVideoInputModel['canBeDownloaded'],
    @Max(18)
    @Min(1)
    @NullableNumber()
    minAgeRestriction?: h01.UpdateVideoInputModel['minAgeRestriction'],
    @Format({ format: '$date-time ' })
    publicationDate?: h01.UpdateVideoInputModel['publicationDate']
  ) {
    for (const arg of arguments) {
    }

    const video: Partial<h01.Video> = {
      id,
      author: author || this.author,
      title: title || this.title,
      canBeDownloaded: canBeDownloaded || this.canBeDownloaded,
      minAgeRestriction: minAgeRestriction || this.minAgeRestriction,
      createdAt: this.createdAt,
      publicationDate: this.publicationDate,
      availableResolutions: this.availableResolutions,
    };

    return video;
  }
}
