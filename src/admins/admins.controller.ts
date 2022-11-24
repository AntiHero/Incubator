import { Response } from 'express';

import { Roles } from 'root/users/types/roles';
import { UsersService } from 'root/users/users.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
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
import { BanDTO } from './dto/bad.dto';
import { IdValidationPipe } from 'root/@common/pipes/id-validation.pipe';

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

  @Put(':id/ban')
  async banUser(
    @Param('id', IdValidationPipe) id,
    @Body() body: BanDTO,
    @Res() res: Response,
  ) {
    const user = await this.usersService.banUser(id, body);

    if (!user) return res.status(404).send();

    res.status(204).send();
  }

  @Delete(':id')
  async deleteUser(@Param('id') id, @Res() res: Response) {
    const user = await this.usersService.findUserByIdAndDelete(id);

    if (!user) return res.status(404).send();

    res.status(204).send();
  }
}
