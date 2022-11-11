import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { UserInputModel } from './types';
import { UsersService } from './users.service';
import Paginator from 'root/_common/models/Paginator';
import { convertToUserViewModel } from './utils/convertToUserViewModel';
import { SortDirectionKeys, SortDirections } from 'root/_common/types/enum';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async saveBlog(@Body() body: UserInputModel, @Res() res: FastifyReply) {
    const { login, email } = body;

    const savedUser = await this.usersService.saveUser({ login, email });

    res
      .type('text/plain')
      .status(201)
      .send(JSON.stringify(convertToUserViewModel(savedUser)));
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getPosts(@Query() query, @Res() res: FastifyReply) {
    const pageNumber = query.pageNumber ? Number(query.pageNumber) : 1;
    const pageSize = query.pageSize ? Number(query.pageSize) : 10;
    const sortBy = query.sortBy || 'createdAt';
    const sortDirection =
      query.sortDirection === SortDirectionKeys.asc
        ? SortDirections.asc
        : SortDirections.desc;
    const searchLoginTerm = query.searchLoginTerm
      ? new RegExp(query.searchNameTerm, 'i')
      : /.*/i;
    const searchEmailTerm = query.searchEmailTerm
      ? new RegExp(query.searchNameTerm, 'i')
      : /.*/i;

    const [users, totalCount] = await this.usersService.findUsersByQuery({
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchEmailTerm,
      searchLoginTerm,
    });

    const items = users.map(convertToUserViewModel);

    const result = new Paginator(
      Math.ceil(totalCount / pageSize),
      pageNumber,
      pageSize,
      totalCount,
      items,
    );

    res.type('text/plain').status(200).send(JSON.stringify(result));
  }

  @Delete(':id')
  async deleteUser(@Param('id') id, @Res() res: FastifyReply) {
    const user = await this.usersService.findUserByIdAndDelete(id);

    if (!user) return res.status(404).send();

    res.status(204).send();
  }
}
