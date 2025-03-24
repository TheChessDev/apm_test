import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { PermanentTokenAuthGuard } from './permanent-token.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class AppAuthGuard implements CanActivate {
  constructor(
    private readonly permTokenGuard: PermanentTokenAuthGuard,
    private readonly jwtGuard: JwtAuthGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (await this.tryActivate(this.permTokenGuard, context)) {
      return true;
    }
    return this.tryActivate(this.jwtGuard, context);
  }

  private async tryActivate(
    guard: CanActivate,
    context: ExecutionContext,
  ): Promise<boolean> {
    try {
      const result = await guard.canActivate(context);
      if (typeof result === 'boolean') {
        return result;
      }
      return await lastValueFrom(result);
    } catch {
      return false;
    }
  }
}
