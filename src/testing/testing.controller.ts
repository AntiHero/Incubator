import { Controller, Delete, HttpCode } from '@nestjs/common';

import { UsersService } from 'root/users/users.service';
import { BlogsService } from 'root/blogs/blogs.service';
import { TokensService } from 'root/tokens/tokens.service';
import { QuestionsService } from 'root/quiz-game/services/questions.service';
import { BanUsersByBloggerService } from 'root/bloggers/ban-users.service';
import { SecurityDevicesService } from 'root/security-devices/security-devices.service';
import { PairsService } from 'root/quiz-game/services/pairs.service';

@Controller('testing')
export class TestingController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly usersSevice: UsersService,
    private readonly tokensService: TokensService,
    private readonly questionsService: QuestionsService,
    private readonly gamesPairService: PairsService,
    private readonly securityDevicesService: SecurityDevicesService,
    private readonly banUsersByBloggerService: BanUsersByBloggerService,
  ) {}

  @Delete('all-data')
  @HttpCode(204)
  async removeAllData() {
    await this.banUsersByBloggerService.deleteAllBannedUsers();
    await this.blogsService.deleteAllBlogs();
    await this.usersSevice.deleteAllUsers();
    await this.securityDevicesService.deleteAllDevices();
    await this.tokensService.deleteAllTokens();
    await this.gamesPairService.deleteAllPairGames();
    await this.questionsService.deleteAllQuestions();
  }
}
