import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { GitHubProfileDto } from '../auth/dto/github-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOrCreate(profile: GitHubProfileDto): Promise<User> {
    const githubId = profile.id.toString();

    let user = await this.prisma.user.findUnique({
      where: { githubId },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          githubId,
          username: profile.username,
        },
      });
    }

    return user;
  }
}
