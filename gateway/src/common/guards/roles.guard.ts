import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>("roles", [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException("접근 권한이 없습니다.");
    }

    // role 필드가 있는 경우 (단일 역할)
    if (user.role) {
      const hasRole = requiredRoles.some((role) => user.role === role);

      if (!hasRole) {
        throw new ForbiddenException("이 작업을 수행할 권한이 없습니다.");
      }

      return true;
    }

    // roles 필드가 있는 경우 (다중 역할 - 이전 버전 호환성)
    if (user.roles) {
      const hasRole = requiredRoles.some((role) => user.roles.includes(role));

      if (!hasRole) {
        throw new ForbiddenException("이 작업을 수행할 권한이 없습니다.");
      }

      return true;
    }

    throw new ForbiddenException("사용자에게 역할 정보가 없습니다.");
  }
}
