import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { BanUserForBlogDTO } from './dto/banUserForBlogDTO';
import { BanUsersForBlogService } from './ban-user.service';
import { BearerAuthGuard } from 'root/@common/guards/bearer-auth.guard';
import { IdValidationPipe } from 'root/@common/pipes/id-validation.pipe';

@Controller('blogger/users')
@UseGuards(BearerAuthGuard)
export class BloggersUseresController {
  constructor(private readonly banUserService: BanUsersForBlogService) {}

  @Get('blog/:id')
  async getBannedUsersForBlog(
    @Param('id', IdValidationPipe) id: string,
    @Res() res: Response,
  ) {
    res.status(200).send();
  }

  @Put(':id/ban')
  async banUserForBlog(
    @Param('id', IdValidationPipe) userId: string,
    @Body() body: BanUserForBlogDTO,
    @Res() res: Response,
  ) {
    const { blogId, isBanned, banReason } = body;

    const banUserRes = await this.banUserService.banUser(
      userId,
      blogId,
      isBanned,
      banReason,
    );

    if (!banUserRes) return res.status(HttpStatus.NOT_FOUND).end();

    res.status(HttpStatus.NO_CONTENT).end();
  }
}
