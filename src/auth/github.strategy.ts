import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';

import { ConfigService } from '../config/config.service';
import { UsersService } from '../users/users.service';
import { GitHubProfileDto } from './dto/github-profile.dto';
import { User } from '@prisma/client';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly userService: UsersService,
    readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('GITHUB_CLIENT_ID'),
      clientSecret: configService.get('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.get('GITHUB_CALLBACK_URL'),
      scope: ['user:email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): Promise<User> {
    const username = profile.username ?? profile.displayName;
    const githubProfile: GitHubProfileDto = {
      id: profile.id,
      username,
    };

    return this.userService.findOrCreate(githubProfile);
  }
}
