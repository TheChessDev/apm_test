import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import type { JwtPayload } from '../types/jwt-payload';
import { TokensService } from './tokens.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('tokens')
@UseGuards(AuthGuard('jwt'))
export class TokensController {
  constructor(private readonly tokenService: TokensService) {}

  @Post()
  async create(@Req() req: Request, @Body() body: { name?: string }) {
    const userId = (req.user as JwtPayload).sub;
    const token = await this.tokenService.createToken(userId, body?.name);
    return { token };
  }
}
