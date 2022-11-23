import { Response } from 'express';

import { Roles } from 'root/users/types/roles';
import { UsersService } from 'root/users/users.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';

import { PaginationQuery } from 'root/@common/types';
import Paginator from 'root/@common/models/Paginator';
import { CreateUserDto } from 'root/users/dto/create-user.dto';
import { BasicAuthGuard } from 'root/@common/guards/basic.auth.guard';
import { convertToUserViewModel } from 'root/users/utils/convertToUserViewModel';
import { PaginationQuerySanitizerPipe } from 'root/@common/pipes/pagination-query-sanitizer.pipe';

@Controller('sa/users')
@UseGuards(BasicAuthGuard)
export class AdminsController {
  constructor(private usersService: UsersService) {}

  @Post()
  async createAdmin(@Body() body: CreateUserDto, @Res() res: Response) {
    const { login, email, password } = body;

    const savedUser = await this.usersService.createUser({
      login,
      email,
      password,
      role: Roles.SUPER_ADMIN,
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
}
