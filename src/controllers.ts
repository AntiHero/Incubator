import http from 'node:http';
import fs from 'node:fs/promises';
import { resolve } from 'node:path';

import { h01 } from './@types';

import videos from './fakeDb';
import { Video } from './model/video';

export async function getFavicon(
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>
): Promise<void> {
  res.writeHead(200, { 'Content-Type': 'image/x-icon' });

  try {
    const favicon = await fs.readFile(
      resolve(process.cwd(), 'public/favicon.ico')
    );

    res.write(favicon);
  } catch (e) {
    console.error({ message: "Can't read favicon file", path: req.url });
  }

  res.end();
}

export async function getVideos(
  _: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>
): Promise<void> {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
  });

  return Promise.resolve().then(() => {
    res.write(JSON.stringify(videos));
  });
}

export async function deleteVideos(
  _: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>
): Promise<void> {
  await Promise.resolve().then(() => {
    videos.splice(0);
  });

  res.statusCode = 204;
}

export async function getVideo(
  _: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>,
  id: string
) {
  for (const video of videos) {
    if (video.id === parseInt(id)) {
      res.writeHead(200, {
        'Content-Type': 'text/plain',
      });

      return Promise.resolve().then(() => {
        res.write(JSON.stringify(video));
      });
    }

    res.statusCode = 404;
  }
}

export async function postVideo(
  _: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>,
  { author, title, availableResolutions }: h01.CreateVideoInputModel
) {
  const video = new Video().create(author, title, availableResolutions);

  return Promise.resolve().then(() => {
    videos.push(video);

    res.writeHead(201, {
      'Content-Type': 'text/plain',
    });
    res.write(JSON.stringify(video));
  });
}

export async function updateVideo(
  _: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>,
  {
    id,
    author,
    title,
    availableResolutions,
    canBeDownloaded,
    minAgeRestriction,
    publicationDate,
  }: { id: number } & h01.UpdateVideoInputModel
) {
  try {
    const updatedVideo = new Video().update(
      id,
      author,
      title,
      availableResolutions,
      canBeDownloaded,
      minAgeRestriction,
      publicationDate
    );

    let isFound = false;

    for (const video of videos) {
      if (video.id === id) {
        isFound = true;

        await Promise.resolve().then(() => {
          for (const key in updatedVideo) {
            if (key in video) {
              (video as any)[key] =
                updatedVideo[key as keyof Partial<h01.Video>];
            }
          }
        });
      }
    }

    res.statusCode = 204;

    if (!isFound) {
      res.statusCode = 404;
    }
  } catch (e) {
    throw new Error('Creation error');
  }
}

export async function deleteVideo(
  _: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>,
  id: number
) {
  for (let i = 0; i < videos.length; i++) {
    if (videos[i].id === id) {
      await Promise.resolve().then(() => videos.splice(i, 1));

      res.statusCode = 204;

      return;
    }
  }

  res.statusCode = 404;
}
