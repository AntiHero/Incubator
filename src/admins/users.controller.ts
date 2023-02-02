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

import { BanUserDTO } from './dto/ban-user.dto';
import { AdminsService } from './admins.service';
import Paginator from 'root/@common/models/Paginator';
import { PaginationQueryType } from 'root/@common/types';
import { CreateUserDto } from 'root/users/dto/create-user.dto';
import { BasicAuthGuard } from 'root/@common/guards/basic.auth.guard';
import { IdValidationPipe } from 'root/@common/pipes/id-validation.pipe';
import { convertToUserViewModel } from 'root/users/utils/convertToUserViewModel';
import { PaginationQuerySanitizerPipe } from 'root/@common/pipes/pagination-query-sanitizer.pipe';

@Controller('sa/users')
@UseGuards(BasicAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly adminsService: AdminsService,
  ) {}

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
    @Query(PaginationQuerySanitizerPipe) query: PaginationQueryType,
    @Res() res: Response,
  ) {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchEmailTerm,
      searchLoginTerm,
      banStatus,
    } = query;

    const [users, totalCount] = await this.usersService.findUsersByQuery(
      {
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
        searchEmailTerm,
        searchLoginTerm,
        banStatus,
      },
      Roles.SUPER_ADMIN,
    );

    const items = users.map(convertToUserViewModel);

    const result = new Paginator(pageNumber, pageSize, totalCount, items);

    res.type('text/plain').status(200).send(JSON.stringify(result));
  }

  @Put(':id/ban')
  async banUser(
    @Param('id', IdValidationPipe) id,
    @Body() body: BanUserDTO,
    @Res() res: Response,
  ) {
    const user = await this.adminsService.banUser(id, body);

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
