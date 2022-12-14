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

import { User } from './models/user.model';
import { UsersService } from './users.service';
import { PaginationQuery, PaginationQueryType } from 'root/@common/types';
import Paginator from 'root/@common/models/Paginator';
import { CreateUserDto } from './dto/create-user.dto';
import { BasicAuthGuard } from 'root/@common/guards/basic.auth.guard';
import { convertToUserViewModel } from './utils/convertToUserViewModel';
import {
  PaginationQuerySanitizer,
  PaginationQuerySanitizerPipe,
} from 'root/@common/pipes/pagination-query-sanitizer.pipe';

@Controller('users')
@UseGuards(BasicAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async saveUser(@Body() body: CreateUserDto, @Res() res: Response) {
    const { login, email, password } = body;

    const user = new User({
      login,
      email,
      password,
    });
    const savedUser = await this.usersService.createUser(user);

    res
      .type('text/plain')
      .status(201)
      .send(JSON.stringify(convertToUserViewModel(savedUser)));
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(
    // @Query(PaginationQuerySanitizerPipe) query: PaginationQuery,
    @Query(PaginationQuerySanitizer) query: PaginationQueryType,
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

  /* Test */
  @Get(':id')
  async getUserById(@Param('id') id: string, @Res() res: Response) {
    res.status(200).send(await this.usersService.findUserById(id));
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    const user = await this.usersService.findUserByIdAndDelete(id);

    if (!user) return res.status(404).send();

    res.status(204).send();
  }
}
