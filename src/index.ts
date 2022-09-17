import http from 'node:http';
import { APIErrorResult } from './@types';

import * as Controllers from './controllers';
// import { FieldError, APIErrorResult } from './@types';

const PORT = process.env.PORT || 9009;

export const errors: APIErrorResult = { errorsMessages: [] };

const server = http.createServer(async (req, res) => {
  switch (req.url) {
    case '/favicon.ico': {
      await Controllers.getFavicon(req, res);

      return;
    }
    case '/hometask_01/api/videos': {
      await Controllers.getVideos(req, res);

      break;
    }
    case '/testing/all-data': {
      switch (req.method) {
        case 'DELETE': {
          await Controllers.deleteVideos(req, res);

          console.log(res.statusCode, 'statusCode');

          break;
        }
      }
    }
  }

  res.end();
});

server.listen(PORT, () => {
  console.log('Server is running at http://localhost:%s', PORT);
});
