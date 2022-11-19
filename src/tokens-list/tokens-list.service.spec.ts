import { Test, TestingModule } from '@nestjs/testing';
import { TokensListService } from './tokens-list.service';

describe('TokensListService', () => {
  let service: TokensListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokensListService],
    }).compile();

    service = module.get<TokensListService>(TokensListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
