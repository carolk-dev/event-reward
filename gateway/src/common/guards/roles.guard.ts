import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>("roles", context.getHandler());

    // 역할 제한이 없으면 모든 인증된 사용자 허용
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 이미 AuthGuard에서 user 검증은 완료되었으므로 여기서는 role만 검증
    // 하지만 안전을 위해 user 객체가 있는지 확인
    if (!user || !user.role) {
      this.logger.warn("권한 검증 실패: 사용자에게 역할 정보가 없습니다");
      throw new ForbiddenException("해당 기능에 접근할 권한이 없습니다.");
    }

    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      this.logger.warn(`권한 거부: 사용자 역할 ${user.role}, 필요한 역할: ${requiredRoles.join(", ")}`);
      throw new ForbiddenException(`접근 거부: ${requiredRoles.join(", ")} 역할이 필요합니다.`);
    }

    this.logger.debug(`권한 검증 성공: 사용자 ID ${user.sub || user._id}, 역할: ${user.role}`);
    return hasRole;
  }
}
