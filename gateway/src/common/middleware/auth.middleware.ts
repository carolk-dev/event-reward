import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private authServiceUrl: string;

  constructor(private configService: ConfigService) {
    this.authServiceUrl = this.configService.get<string>("AUTH_SERVICE_URL", "http://auth:3001");
  }

  async use(req: Request, res: Response, next: NextFunction) {
    // 인증 헤더가 없는 경우 패스
    if (!req.headers.authorization) {
      return next();
    }

    const token = req.headers.authorization.split(" ")[1];

    try {
      // Auth 서비스에 토큰 검증 요청
      const response = await axios.post(
        `${this.authServiceUrl}/auth/validate`,
        { payload: token },
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": this.configService.get<string>("INTERNAL_API_KEY"),
          },
        }
      );

      // 검증 성공 시 req.user에 사용자 정보 설정
      if (response.data) {
        req["user"] = response.data;
      }

      next();
    } catch (error) {
      console.error("토큰 검증 오류:", error.message);
      // 토큰 검증 실패 시에도 다음 단계로 진행 (각 엔드포인트에서 가드로 처리)
      next();
    }
  }
}
