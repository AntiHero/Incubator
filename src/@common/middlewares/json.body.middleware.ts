import { Injectable, NestMiddleware } from '@nestjs/common';
import { json } from 'body-parser';

@Injectable()
export class JsonBodyMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => any) {
    json()(req, res, next);
  }
}
