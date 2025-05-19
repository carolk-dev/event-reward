import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 요청에서 사용자 정보 가져오기
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      this.logger.warn("인증 실패: 사용자 정보가 없습니다");
      throw new UnauthorizedException("인증이 필요합니다. 유효한 토큰을 제공해주세요.");
    }

    // 요청 핸들러에서 필요한 역할 정보 추출 (선택적)
    const requiredRoles = this.reflector.get<string[]>("roles", context.getHandler());

    // 역할 요구사항이 없으면 인증된 사용자로 충분
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // 사용자 역할 확인
    const userRole = user.role;
    if (!userRole) {
      this.logger.warn(`역할 확인 실패: 사용자 ${user.sub || user._id}에게 역할이 없습니다`);
      return false;
    }

    this.logger.debug(`인증 성공: 사용자 ID ${user.sub || user._id}, 역할: ${userRole}`);
    return true;
  }
}
