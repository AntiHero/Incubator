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
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { UserInputModel } from './types';
import { UsersService } from './users.service';
import { PaginationQuery } from 'root/@common/types';
import Paginator from 'root/@common/models/Paginator';
import { BasicAuthGuard } from 'root/@common/guards/basic.auth.guard';
import { convertToUserViewModel } from './utils/convertToUserViewModel';
import { PaginationQuerySanitizerPipe } from 'root/@common/pipes/pagination.query.sanitizer.pipe';

@Controller('users')
@UseGuards(BasicAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async saveUser(@Body() body: UserInputModel, @Res() res: Response) {
    const { login, email, password } = body;

    const savedUser = await this.usersService.saveUser({
      login,
      email,
      password,
    });

    res
      .type('text/plain')
      .status(201)
      .send(JSON.stringify(convertToUserViewModel(savedUser)));
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(
    @Query(PaginationQuerySanitizerPipe) query: PaginationQuery,
    @Res() res: Response,
  ) {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchEmailTerm,
      searchLoginTerm,
    } = query;

    // const pageNumber = query.pageNumber ? Number(query.pageNumber) : 1;
    // const pageSize = query.pageSize ? Number(query.pageSize) : 10;
    // const sortBy = query.sortBy || 'createdAt';
    // const sortDirection =
    //   query.sortDirection === SortDirectionKeys.asc
    //     ? SortDirections.asc
    //     : SortDirections.desc;
    // const searchLoginTerm = query.searchLoginTerm
    //   ? new RegExp(query.searchLoginTerm, 'i')
    //   : /.*/i;
    // const searchEmailTerm = query.searchEmailTerm
    //   ? new RegExp(query.searchEmailTerm, 'i')
    //   : /.*/i;

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
  async deleteUser(@Param('id') id, @Res() res: Response) {
    const user = await this.usersService.findUserByIdAndDelete(id);

    if (!user) return res.status(404).send();

    res.status(204).send();
  }
}
