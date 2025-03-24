import { Test, TestingModule } from '@nestjs/testing';
import { TokensService } from './tokens.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TokensService', () => {
  let service: TokensService;

  const mockPrisma = {
    permanentToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokensService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<TokensService>(TokensService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createToken', () => {
    it('should create a token for a given user and return it', async () => {
      const tokenValue = 'random-token-value';
      const fakeRecord = { token: tokenValue };
      mockPrisma.permanentToken.create.mockResolvedValue(fakeRecord);

      const userId = 1;
      const name = 'Frontend App Token';

      const result = await service.createToken(userId, name);
      expect(result).toBe(tokenValue);
      expect(mockPrisma.permanentToken.create).toHaveBeenCalledWith({
        data: { userId, token: expect.any(String) as string, name },
      });
    });
  });

  describe('findByToken', () => {
    it('should find a token record by token value', async () => {
      const tokenValue = 'random-token-value';
      const fakeRecord = { token: tokenValue, userId: 1 };
      mockPrisma.permanentToken.findUnique.mockResolvedValue(fakeRecord);

      const result = await service.findByToken(tokenValue);
      expect(result).toEqual(fakeRecord);
      expect(mockPrisma.permanentToken.findUnique).toHaveBeenCalledWith({
        where: { token: tokenValue },
      });
    });
  });

  describe('revokeToken', () => {
    it('should delete a token record by token value', async () => {
      const tokenValue = 'random-token-value';
      const fakeRecord = { token: tokenValue, userId: 1 };
      mockPrisma.permanentToken.delete.mockResolvedValue(fakeRecord);

      const result = await service.revokeToken(tokenValue);
      expect(result).toEqual(fakeRecord);
      expect(mockPrisma.permanentToken.delete).toHaveBeenCalledWith({
        where: { token: tokenValue },
      });
    });
  });
});
