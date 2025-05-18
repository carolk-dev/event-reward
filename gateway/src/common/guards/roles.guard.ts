import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 해당 라우트에 필요한 역할 가져오기
    const requiredRoles = this.reflector.get<string[]>("roles", context.getHandler());

    // 라우트에 역할 제한이 없으면 통과
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // 요청에서 사용자 정보 가져오기
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 역할이 있는지 확인하고 권한 체크
    if (!user || !user.roles) {
      throw new ForbiddenException("권한이 없습니다.");
    }

    // 사용자가 필요한 역할 중 하나라도 가지고 있는지 확인
    const hasRole = requiredRoles.some((role) => user.roles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException("해당 작업을 수행할 권한이 없습니다.");
    }

    return true;
  }
}
