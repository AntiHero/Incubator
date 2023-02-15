import {
  Get,
  Post,
  Body,
  Param,
  Query,
  Header,
  HttpCode,
  UseGuards,
  Controller,
  HttpStatus,
  HttpException,
  ParseIntPipe,
} from '@nestjs/common';

import { PairsQuery } from './types';
import { IdDTO } from './dto/user-id.dto';
import Paginator from 'root/@common/models/Paginator';
import { CreateAnswerDTO } from './dto/create-answer.dto';
import { GamePairErrors, GameStatuses } from './types/enum';
import { GamePairConverter } from './utils/pairs.converter';
import { AnswersConverter } from './utils/answers.converter';
import { PairsQueryParsePipe } from './@common/pairs-query.pipe';
import { UserId } from 'root/@common/decorators/user-id.decorator';
import { Service } from 'root/@common/decorators/service.decorator';
import { PairsService } from 'root/quiz-game/services/pairs.service';
import { BearerAuthGuard } from 'root/@common/guards/bearer-auth.guard';
import { PairsTransactionService } from './services/pairs.transaction.service';

@Controller('pair-game-quiz/pairs')
export class PairsController {
  constructor(private readonly pairsService: PairsService) {}

  @Get('my-current')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerAuthGuard)
  @Header('Content-type', 'text/plain')
  async getMyCurrentGame(@UserId() userId: string) {
    const myGame = await this.pairsService.getMyCurrentGame(userId);

    if (!myGame) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    return myGame.status === GameStatuses.Pending
      ? GamePairConverter.toOnePlayerView(myGame)
      : GamePairConverter.toView(myGame);
  }

  @Get('my')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerAuthGuard)
  @Header('Content-type', 'text/plain')
  async my(
    @UserId(ParseIntPipe) userId: number,
    @Query(PairsQueryParsePipe) query: PairsQuery,
  ) {
    const { pageSize, pageNumber } = query;

    const [games, totalCount] = await this.pairsService.getMyGames(
      userId,
      query,
    );

    const items = games.map(GamePairConverter.toView);

    const result = new Paginator(pageNumber, pageSize, totalCount, items);

    return result;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerAuthGuard)
  @Header('Content-type', 'text/plain')
  async getGame(@Param() params: IdDTO, @UserId() userId: string) {
    const { id: gameId } = params;

    const game = await this.pairsService.getFinishedGameById(gameId);

    if (!game) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    if (game.firstPlayer.id !== userId && game.secondPlayer.id !== userId)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return game.status === GameStatuses.Pending
      ? GamePairConverter.toOnePlayerView(game)
      : GamePairConverter.toView(game);
  }

  @Post('connection')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerAuthGuard)
  @Header('Content-type', 'text/plain')
  async createGame(@UserId() userId: string) {
    const myCurrentGame = await this.pairsService.getMyCurrentGame(userId);

    if (myCurrentGame)
      throw new HttpException(
        GamePairErrors.ALREADY_HAS_A_GAME,
        HttpStatus.FORBIDDEN,
      );

    const game = await this.pairsService.createConnection(userId);

    return game.status === GameStatuses.Pending
      ? GamePairConverter.toOnePlayerView(game)
      : GamePairConverter.toView(game);
  }

  @Post('/my-current/answers')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerAuthGuard)
  @Header('Content-type', 'text/plain')
  async answer(
    @Service(PairsTransactionService)
    pairsTransactionService: PairsTransactionService,
    @UserId() userId: string,
    @Body() body: CreateAnswerDTO,
  ) {
    const { answer } = body;

    const proceededAnswer = await pairsTransactionService.proceedAnswer(
      userId,
      answer,
    );
    if (!proceededAnswer)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return AnswersConverter.toView(proceededAnswer);
  }
}
