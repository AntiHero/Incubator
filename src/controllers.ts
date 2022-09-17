import http from 'node:http';
import fs from 'node:fs/promises';
import { resolve } from 'node:path';

import videos from './fakeDb';

export async function getFavicon (
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

export async function getVideos (
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

export async function deleteVideos (
  _: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>
): Promise<void> {
  await Promise.resolve().then(() => {
    videos.splice(0);
  });

  res.statusCode = 204;
}
