import http from 'node:http';

import * as Controllers from './controllers';
import { FieldError, APIErrorResult } from './@types';

const PORT = process.env.PORT || 9009;

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
    case '/ht_01/api/testing/all-data': {
      switch (req.method) {
        case 'DELETE': {
          await Controllers.deleteVideos(req, res);
          
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
