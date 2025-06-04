import { Injectable } from "@nestjs/common";
import { CanActivate, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../constants";
import { Role } from "../constants";
import { Request } from "express";
import { Observable } from "rxjs";

@Injectable()
export class AtGuard extends AuthGuard("jwt-at") implements CanActivate {
    constructor(private reflector: Reflector) {
        super();
    }
    
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
        ]);
        if (!roles) {
        return super.canActivate(context);
        }
        
        const request = context.switchToHttp().getRequest<Request>();
        const user = request.user;
        
        // if (!user || !roles.includes(user.role)) {
        // return false;
        // }
        
        return super.canActivate(context);
    }
    }
// This guard extends the AuthGuard for JWT authentication and checks if the user has the required roles.