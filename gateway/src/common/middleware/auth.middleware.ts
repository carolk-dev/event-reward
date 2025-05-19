import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../../auth/auth.service";
import { Logger } from "@nestjs/common";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // 인증 헤더가 없는 경우 패스
    if (!req.headers.authorization) {
      return next();
    }

    const token = req.headers.authorization.split(" ")[1];

    try {
      // 내부적으로 토큰 검증
      this.logger.debug(`토큰 검증 시작: ${token.substring(0, 15)}...`);
      const user = await this.authService.validateUser(token);

      // 검증 성공 시 req.user에 사용자 정보 설정
      if (user) {
        req["user"] = user;
        this.logger.debug(`토큰 검증 성공: 사용자 ID ${user.sub || user._id || "unknown"}`);
      } else {
        this.logger.warn(`토큰 검증 실패: 유효하지 않은 토큰`);
      }

      next();
    } catch (error) {
      this.logger.error(`토큰 검증 오류: ${error.message}`);
      // 토큰 검증 실패 시에도 다음 단계로 진행 (각 엔드포인트에서 가드로 처리)
      next();
    }
  }
}
