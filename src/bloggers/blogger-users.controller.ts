import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { UsersService } from 'root/users/users.service';
import { BearerAuthGuard } from 'root/@common/guards/bearer-auth.guard';
import { IdValidationPipe } from 'root/@common/pipes/id-validation.pipe';

@Controller('blogger/users')
@UseGuards(BearerAuthGuard)
export class BloggersUseresController {
  constructor(private readonly usersService: UsersService) {}

  @Get('blog/:id')
  async getBannedUsersForBlog(
    @Param('id', IdValidationPipe) id: string,
    @Res() res: Response,
  ) {
    res.status(200).send();
  }
}
