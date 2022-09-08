import http from 'node:http';
import fs from 'node:fs/promises';
import { resolve } from 'node:path';

const PORT = process.env.PORT || 3005;
let requestCounter = 0;

const server = http.createServer(async (req, res) => {
  switch (req.url) {
    case '/': {
      res.write('Home');
      break;
    }
    case '/favicon.ico': {
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
      return;
    }
    case '/students': {
      res.write('STUDENTS');
      break;
    }
    case '/courses': {
      res.write('FRONT + BACK');
      break;
    }
    default: {
      res.statusCode = 404;
      res.write('404 not found');
    }
  }

  requestCounter++;
  res.write(' IT-KAMASUTRA: :' + requestCounter);

  res.end();
});

server.listen(PORT, () => {
  console.log('Server is running at http://localhost:%s', PORT);
});
