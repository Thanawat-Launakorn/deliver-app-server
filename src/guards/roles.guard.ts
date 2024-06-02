import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Roles } from 'src/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('Inside RolesGuard');
    const request = context.switchToHttp().getRequest();
    const requestRoles = this.reflector.get(Roles, context.getHandler());
    const userRole = request.user.role;
    return requestRoles.includes(userRole);
  }
}
