import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from "@nestjs/common";
import { UserRole } from "../constants/roles";

@Injectable()
export class UserMatchGuard implements CanActivate {
  private readonly logger = new Logger(UserMatchGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 사용자 정보가 없으면 검증 실패
    if (!user) {
      this.logger.warn("사용자 ID 검증 실패: 사용자 정보가 없습니다");
      return false;
    }

    // ADMIN 역할은 항상 통과
    if (user.role === UserRole.ADMIN) {
      this.logger.debug(`ADMIN 역할 사용자 ${user.sub || user._id}는 ID 검증 없이 통과`);
      return true;
    }

    // USER 역할인 경우에만 사용자 ID 검증
    if (user.role === UserRole.USER) {
      const userId = request.body.userId;

      // body에 userId가 없는 경우
      if (!userId) {
        this.logger.warn("사용자 ID 검증 실패: 요청 body에 userId가 없습니다");
        throw new ForbiddenException("보상 요청에 사용자 ID가 필요합니다");
      }

      // 자신의 ID와 요청된 userId가 일치하는지 확인
      const userIdFromToken = user.sub || user._id;
      const isMatch = userId === userIdFromToken;

      if (!isMatch) {
        this.logger.warn(`사용자 ID 불일치: 토큰의 ID(${userIdFromToken})와 요청 ID(${userId})가 다릅니다`);
        throw new ForbiddenException("자신의 보상만 요청할 수 있습니다");
      }

      this.logger.debug(`사용자 ID 검증 성공: ${userIdFromToken}`);
      return true;
    }

    // 다른 역할은 이 가드와 관계없이 처리 (다른 가드에서 처리됨)
    return true;
  }
}
