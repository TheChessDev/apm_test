import { HttpService } from '@nestjs/axios';
import { AuthGuard } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '../config/config.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAccessJwt = { sign: jest.fn() };
  const mockRefreshJwt = { sign: jest.fn(), verify: jest.fn() };

  const mockPrisma = {
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockConfig = {
    get: jest.fn((key: string) => {
      const defaults: Record<string, string | number> = {
        JWT_REFRESH_EXPIRATION_MS: 3600000, // 1 hour in ms
        GITHUB_CLIENT_ID: 'test-client-id',
        GITHUB_CLIENT_SECRET: 'test-client-secret',
      };
      return defaults[key];
    }),
  };

  const mockHttp = {
    post: jest.fn(),
    get: jest.fn(),
  };

  const mockUserService = {
    findOrCreate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: 'ACCESS_JWT', useValue: mockAccessJwt },
        { provide: 'REFRESH_JWT', useValue: mockRefreshJwt },
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ConfigService, useValue: mockConfig },
        { provide: HttpService, useValue: mockHttp },
        { provide: UsersService, useValue: mockUserService },
      ],
    })
      .overrideGuard(AuthGuard('github'))
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
