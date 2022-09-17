import http from 'node:http';
import { APIErrorResult, h01 } from './@types';

import * as Controllers from './controllers';
import * as constants from './constants';
import { checkRouteWithId } from './utils/checkRouteWithId';
import { getIdFromRoute } from './utils/getIdFromRoute';

const PORT = process.env.PORT || 9009;

export const errors: APIErrorResult = { errorsMessages: [] };

const server = http.createServer(async (req, res) => {
  let url = req.url as string;
  let id = '';

  const isRouteWithId = checkRouteWithId(req.url as string);

  if (isRouteWithId) {
    url = `${constants.BASE_ROUTE}/:id`;
    id = getIdFromRoute(url);
  }

  switch (url) {
    case '/favicon.ico': {
      await Controllers.getFavicon(req, res);

      return;
    }
    case `${constants.BASE_ROUTE}`: {
      switch (req.method) {
        case 'GET': {
          await Controllers.getVideos(req, res);

          break;
        }
        case 'POST': {
          let rawData = '';
          let resolvePromise: () => void;

          req.on('data', chunk => {
            rawData += chunk;
          });

          req.on('end', async () => {
            try {
              const parsedData = JSON.parse(
                rawData
              ) as h01.CreateVideoInputModel;

              await Controllers.postVideo(req, res, parsedData);

              resolvePromise();
            } catch (e) {
              if (errors.errorsMessages.length) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.write(JSON.stringify(errors.errorsMessages));
                errors.errorsMessages.splice(0);
              }
            }
          });

          await new Promise<void>(resolve => {
            resolvePromise = resolve;
          });

          break;
        }
      }

      break;
    }
    case `${constants.BASE_ROUTE}/:id`: {
      switch (req.method) {
        case 'GET': {
          await Controllers.getVideo(req, res, id);

          break;
        }
      }

      break;
    }
    case '/testing/all-data': {
      switch (req.method) {
        case 'DELETE': {
          await Controllers.deleteVideos(req, res);

          break;
        }
      }

      break;
    }
    default: {
      res.statusCode = 404;
      res.write('path not found');
    }
  }

  res.end();
});

server.listen(PORT, () => {
  console.log('Server is running at http://localhost:%s', PORT);
});
