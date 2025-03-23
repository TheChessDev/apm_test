import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('ACCESS_JWT') private accessJwt: JwtService,
    @Inject('REFRESH_JWT') private refreshJwt: JwtService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly http: HttpService,
    private readonly userService: UsersService,
  ) {}

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubLogin() {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req: Request) {
    const user = req.user as { id: number; username: string };

    const payload = { sub: user.id, username: user.username };

    const accessToken = this.accessJwt.sign(payload);
    const refreshToken = this.refreshJwt.sign(payload);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(
          Date.now() + this.config.get('JWT_REFRESH_EXPIRATION_MS'),
        ),
      },
    });

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  @Post('token')
  async getToken(@Body('code') code: string) {
    if (!code) {
      throw new UnauthorizedException('Missing GitHub auth code');
    }

    const response = await lastValueFrom<{ data: { access_token: string } }>(
      this.http.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: this.config.get('GITHUB_CLIENT_ID'),
          client_secret: this.config.get('GITHUB_CLIENT_SECRET'),
          code,
        },
        {
          headers: {
            Accept: 'application/json',
          },
        },
      ),
    );

    const githubAccessToken: string = response.data.access_token;

    if (!githubAccessToken) {
      throw new UnauthorizedException('GitHub token exchange failed');
    }

    const { data: profile } = await lastValueFrom<{
      data: { id: number; username: string };
    }>(
      this.http.get('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${githubAccessToken}`,
        },
      }),
    );

    const user: User = await this.userService.findOrCreate(profile);

    const payload = { sub: user.id, username: user.username };

    const accessToken = this.accessJwt.sign(payload);
    const refreshToken = this.refreshJwt.sign(payload);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(
          Date.now() + this.config.get('JWT_REFRESH_EXPIRATION_MS'),
        ),
      },
    });

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  @Post('refresh')
  async refreshToken(@Body('refresh_token') token: string) {
    if (!token) {
      throw new UnauthorizedException('Missing refresh token');
    }

    const found = await this.prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!found || found.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const payload: { sub: number; username: string } =
      this.refreshJwt.verify(token);

    await this.prisma.refreshToken.delete({ where: { token } });

    const newPayload = { sub: payload.sub, username: payload.username };
    const newAccessToken = this.accessJwt.sign(newPayload);
    const newRefreshToken = this.refreshJwt.sign(newPayload);

    await this.prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: payload.sub,
        expiresAt: new Date(
          Date.now() + this.config.get('JWT_REFRESH_EXPIRATION_MS'),
        ),
      },
    });

    return { access_token: newAccessToken, refresh_token: newRefreshToken };
  }
}
