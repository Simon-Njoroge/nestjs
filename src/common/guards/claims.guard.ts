// src/common/guards/claims.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const REQUIRED_CLAIMS_KEY = 'required_claims';
export const RequiredClaims = (...claims: string[]) =>
  SetMetadata(REQUIRED_CLAIMS_KEY, claims);

@Injectable()
export class ClaimsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredClaims = this.reflector.getAllAndOverride<string[]>(
      REQUIRED_CLAIMS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredClaims?.length) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const userClaims = [...(user?.roles || []), ...(user?.permissions || [])];

    const hasClaim = requiredClaims.every((claim) =>
      userClaims.includes(claim),
    );

    if (!hasClaim) {
      throw new ForbiddenException('You do not have required permissions.');
    }

    return true;
  }
}
