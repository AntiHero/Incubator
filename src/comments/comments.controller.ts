import { Controller, Get, Param, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { CommentsService } from './comments.service';
import { convertToCommentViewModel } from './utils/convertToCommentViewModel';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get(':id')
  async getComments(@Param('id') id, @Res() res: FastifyReply) {
    const comment = await this.commentsService.getExtendedCommentInfo(id);

    if (!comment) {
      return res.status(404).send();
    }
    res
      .type('text/plain')
      .status(200)
      .send(JSON.stringify(convertToCommentViewModel(comment)));
  }
}
