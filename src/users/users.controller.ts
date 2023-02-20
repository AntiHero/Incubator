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
  UsePipes,
} from '@nestjs/common';
import { Response } from 'express';

import { User } from './models/user.model';
import { UsersService } from './users.service';
import Paginator from 'root/@core/models/Paginator';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationQueryType } from 'root/@core/types';
import { BasicAuthGuard } from 'root/@core/guards/basic.auth.guard';
import { convertToUserViewModel } from './utils/convertToUserViewModel';
import { UserUnicityValidationPipe } from 'root/@core/pipes/user-unicity-validation.pipe';
import { PaginationQuerySanitizerPipe } from 'root/@core/pipes/pagination-query-sanitizer.pipe';

@Controller('users')
@UseGuards(BasicAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UsePipes(UserUnicityValidationPipe)
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

    const result = new Paginator(pageNumber, pageSize, totalCount, items);

    res.type('text/plain').status(200).send(JSON.stringify(result));
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    const user = await this.usersService.findUserByIdAndDelete(id);

    if (!user) return res.status(404).send();

    res.status(204).send();
  }
}
