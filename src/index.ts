import http from 'node:http';
import { h01 } from './@types';

import { errors } from './errors';
import * as constants from './constants';
import * as Controllers from './controllers';
import { getIdFromRoute } from './utils/getIdFromRoute';
import { checkRouteWithId } from './utils/checkRouteWithId';

const PORT = process.env.PORT || 9009;

const server = http.createServer(async (req, res) => {
  let url = req.url as string;
  let id = '';

  const isRouteWithId = checkRouteWithId(req.url as string);

  if (isRouteWithId) {
    id = getIdFromRoute(url);
    url = `${constants.BASE_ROUTE}/:id`;
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
                // res.writeHead(400, { 'Content-Type': 'text/plain' });
                // res.write(JSON.stringify(errors.errorsMessages));
                // errors.errorsMessages.splice(0);
              }
              res.statusCode = 403;
              res.end();
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
          console.log('here', id);
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
  }

  res.end();
});

server.listen(PORT, () => {
  console.log('Server is running at http://localhost:%s', PORT);
});
