import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { timingSafeEqual } from 'crypto';
import { appConstants } from '../constants';

function isValidPassword(candidate: string): boolean {
  const expected = appConstants.password;
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(candidate), Buffer.from(expected));
}

@Injectable()
export class AppPasswordGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authorization: string | undefined = request.headers?.authorization;

    if (!authorization || !isValidPassword(authorization)) {
      throw new UnauthorizedException('Unauthorized');
    }

    return true;
  }
}
