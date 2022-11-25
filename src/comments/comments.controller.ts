import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { BearerAuthGuard } from 'root/@common/guards/bearer-auth.guard';

import { CommentsService } from './comments.service';
import { UpdateCommentDTO } from './dto/update.comment.dto';
import { LikeCommentDTO } from './dto/like-comment-like.dto';
import { UserId } from 'root/@common/decorators/user-id.decorator';
import { convertToCommentViewModel } from './utils/convertToCommentViewModel';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get(':id')
  async getComments(
    @UserId() userId: string,
    @Param('id') id,
    @Res() res: Response,
  ) {
    const comment = await this.commentsService.getExtendedCommentInfo(
      id,
      userId,
    );

    if (!comment) {
      return res.status(404).send();
    }

    res
      .type('text/plain')
      .status(200)
      .send(JSON.stringify(convertToCommentViewModel(comment)));
  }

  @Put(':id')
  @UseGuards(BearerAuthGuard)
  async updateComment(
    @Param('id') id: string,
    @Body() body: UpdateCommentDTO,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const userId = req.userId;
    const { content } = body;

    const comment = await this.commentsService.findCommentById(id);

    if (!comment) return res.status(404).send();

    if (comment.userId !== userId) return res.status(403).send();

    await this.commentsService.findCommentByIdAndUpdate(id, { content });

    res.status(204).send();
  }

  @Put(':id/like-status')
  @UseGuards(BearerAuthGuard)
  async likeComment(
    @Param('id') id: string,
    @Body() body: LikeCommentDTO,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const login = req.login;
    const userId = req.userId;
    const { likeStatus } = body;

    const comment = await this.commentsService.findCommentById(id);

    if (!comment) return res.status(404).send();

    await this.commentsService.likeComment(id, {
      login,
      userId,
      likeStatus,
    });

    res.status(204).send();
  }

  @Delete(':id')
  @UseGuards(BearerAuthGuard)
  async deleteComment(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const userId = req.userId;

    const comment = await this.commentsService.findCommentById(id);

    if (!comment) return res.status(404).send();

    if (comment.userId !== userId) return res.status(403).send();

    await this.commentsService.deleteComment(id);

    res.status(204).send();
  }
}
