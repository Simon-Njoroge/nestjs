import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, IS_PUBLIC_KEY } from '../constants';
import { Role } from '../constants';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AtGuard extends AuthGuard('jwt-at') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 1. Check if route is public, then allow access without auth
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    // 2. Proceed with auth check (JWT validation)
    const canActivateResult = super.canActivate(context);

    // 3. Check for role-based access if roles metadata exists
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      // No roles required, just return auth check result
      return canActivateResult;
    }

    // 4. If roles are required, verify user role after auth succeeds
    // super.canActivate can return boolean or Promise or Observable,
    // so we need to handle all cases.
    if (typeof canActivateResult === 'boolean') {
      if (!canActivateResult) return false;
      return this.checkUserRole(context, requiredRoles);
    } else if (canActivateResult instanceof Promise) {
      return canActivateResult.then((result) => {
        if (!result) return false;
        return this.checkUserRole(context, requiredRoles);
      });
    } else {
      // Observable
      return new Observable<boolean>((subscriber) => {
        canActivateResult.subscribe({
          next: (result) => {
            if (!result) {
              subscriber.next(false);
              subscriber.complete();
            } else {
              subscriber.next(this.checkUserRole(context, requiredRoles));
              subscriber.complete();
            }
          },
          error: (err) => subscriber.error(err),
        });
      });
    }
  }

  private checkUserRole(
    context: ExecutionContext,
    requiredRoles: Role[],
  ): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as { role?: Role | Role[] };

    if (!user) return false;

    if (Array.isArray(user.role)) {
      return user.role.some((r) => requiredRoles.includes(r));
    } else {
      return requiredRoles.includes(user.role as Role);
    }
  }
}
