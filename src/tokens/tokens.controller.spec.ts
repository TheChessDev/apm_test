import { Test, TestingModule } from '@nestjs/testing';
import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

describe('TokensController', () => {
  let controller: TokensController;
  let tokensService: TokensService;

  const mockTokensService = {
    createToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokensController],
      providers: [{ provide: TokensService, useValue: mockTokensService }],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TokensController>(TokensController);
    tokensService = module.get<TokensService>(TokensService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a token and return it', async () => {
    const req = { user: { sub: 1 } } as unknown as Request;
    const body = { name: 'Frontend Token' };
    const tokenValue = 'abc123';

    mockTokensService.createToken.mockResolvedValue(tokenValue);

    const result = await controller.create(req, body);
    expect(result).toEqual({ token: tokenValue });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(tokensService.createToken).toHaveBeenCalledWith(1, body.name);
  });
});
