import { Response } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';

import { QuestionPaginationQuery } from './types';
import Paginator from 'root/@common/models/Paginator';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { BearerAuthGuard } from 'root/@common/guards/bearer-auth.guard';
import { IdValidationPipe } from 'root/@common/pipes/id-validation.pipe';
import { QuestionQuerySanitizerPipe } from 'root/@common/pipes/question-pagination-sanitizter.pipe';
import { UpdatePublishStatusDto } from './dto/update-publish-status.dto';

@Controller('sa/quiz/questions')
export class QuizGameController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @UseGuards(BearerAuthGuard)
  @Header('Content-Type', 'text/plain')
  async createQuestion(@Body() body: CreateQuestionDto) {
    const question = await this.questionsService.createQuestion(body);

    return question;
  }

  @Get()
  @UseGuards(BearerAuthGuard)
  @Header('Content-Type', 'text/plain')
  async getQuestions(
    @Query(QuestionQuerySanitizerPipe) query: QuestionPaginationQuery,
  ) {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchBodyTerm,
      publishedStatus,
    } = query;

    const [totalCount, questions] =
      await this.questionsService.findQuestionsByQuery({
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
        searchBodyTerm,
        publishedStatus,
      });

    const result = new Paginator(
      Math.ceil(totalCount / pageSize),
      pageNumber,
      pageSize,
      totalCount,
      questions,
    );

    return result;
  }

  @Delete(':id')
  @UseGuards(BearerAuthGuard)
  async deleteQuestion(
    @Param('id', IdValidationPipe) id: string,
    @Res() res: Response,
  ) {
    const isDeleted = await this.questionsService.findQuestionByIdAndDelete(id);

    if (!isDeleted) {
      res.sendStatus(HttpStatus.NOT_FOUND);
    } else {
      res.sendStatus(HttpStatus.NO_CONTENT);
    }
  }

  @Put(':id')
  @UseGuards(BearerAuthGuard)
  async updateQuestion(
    @Param('id', IdValidationPipe) id: string,
    @Body() body: CreateQuestionDto,
    @Res() res: Response,
  ) {
    const isUpdated = await this.questionsService.findQuestionByIdAndUpdate(
      id,
      body,
    );

    if (!isUpdated) {
      res.sendStatus(HttpStatus.NOT_FOUND);
    } else {
      res.sendStatus(HttpStatus.NO_CONTENT);
    }
  }

  @Put(':id')
  @UseGuards(BearerAuthGuard)
  async updateQuestionPublishedStatus(
    @Param('id', IdValidationPipe) id: string,
    @Body() body: UpdatePublishStatusDto,
    @Res() res: Response,
  ) {
    const { published } = body;

    const isUpdated = await this.questionsService.updatePublishedStatus(
      id,
      published,
    );

    if (!isUpdated) {
      res.sendStatus(HttpStatus.NOT_FOUND);
    } else {
      res.sendStatus(HttpStatus.NO_CONTENT);
    }
  }
}
