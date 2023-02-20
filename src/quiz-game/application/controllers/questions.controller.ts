import { Response } from 'express';
import {
  Get,
  Put,
  Res,
  Body,
  Post,
  Param,
  Query,
  Delete,
  Header,
  HttpStatus,
  Controller,
  UseGuards,
} from '@nestjs/common';

import { QuestionPaginationQuery } from '../../@common/types';
import Paginator from 'root/@core/models/Paginator';
import { QuestionsService } from '../services/questions.service';
import { CreateQuestionDTO } from '../dtos/create-question.dto';
import { BasicAuthGuard } from 'root/@core/guards/basic.auth.guard';
import { IdValidationPipe } from 'root/@core/pipes/id-validation.pipe';
import { UpdatePublishStatusDTO } from '../dtos/update-publish-status.dto';
import { QuestionQuerySanitizerPipe } from 'root/@core/pipes/question-pagination-sanitizter.pipe';

@Controller('sa/quiz/questions')
export class QuizQuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @UseGuards(BasicAuthGuard)
  @Header('Content-Type', 'text/plain')
  async createQuestion(@Body() body: CreateQuestionDTO) {
    const question = await this.questionsService.createQuestion(body);

    return question;
  }

  @Get()
  @UseGuards(BasicAuthGuard)
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

    const result = new Paginator(pageNumber, pageSize, totalCount, questions);

    return result;
  }

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
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
  @UseGuards(BasicAuthGuard)
  async updateQuestion(
    @Param('id', IdValidationPipe) id: string,
    @Body() body: CreateQuestionDTO,
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

  @Put(':id/publish')
  @UseGuards(BasicAuthGuard)
  async updateQuestionPublishedStatus(
    @Param('id', IdValidationPipe) id: string,
    @Body() body: UpdatePublishStatusDTO,
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
