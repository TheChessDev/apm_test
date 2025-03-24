import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { GitHubProfileDto } from '../auth/dto/github-profile.dto';

describe('UsersService', () => {
  let service: UsersService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    mockPrisma.user.findUnique.mockClear();
    mockPrisma.user.create.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOrCreate', () => {
    const profile: GitHubProfileDto = { id: 123, username: 'testuser' };

    it('should return an existing user if found', async () => {
      const existingUser = { id: 1, githubId: '123', username: 'testuser' };
      mockPrisma.user.findUnique.mockResolvedValue(existingUser);

      const user = await service.findOrCreate(profile);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { githubId: '123' },
      });
      expect(user).toEqual(existingUser);
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });

    it('should create a new user if not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      const newUser = { id: 2, githubId: '123', username: 'testuser' };
      mockPrisma.user.create.mockResolvedValue(newUser);

      const user = await service.findOrCreate(profile);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { githubId: '123' },
      });
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: { githubId: '123', username: 'testuser' },
      });
      expect(user).toEqual(newUser);
    });
  });
});
