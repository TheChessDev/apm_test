import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TokensService } from '../tokens/tokens.service';
import { Request } from 'express';

@Injectable()
export class PermanentTokenAuthGuard implements CanActivate {
  constructor(private tokenService: TokensService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'] || '';
    const [type, token] = authHeader.split(' ');

    if (type === 'Bearer' && token) {
      const record = await this.tokenService.findByToken(token);
      if (record) {
        req.user = { sub: record.userId, tokenType: 'permanent' };
        return true;
      }
    }

    return false;
  }
}
