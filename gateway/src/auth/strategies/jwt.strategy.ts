import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import * as PassportJwt from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../auth.service";
import { Logger } from "@nestjs/common";

const { Strategy, ExtractJwt } = PassportJwt;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) {
    const jwtSecret = configService.get<string>("JWT_SECRET") || "default_secret_key_for_development";

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    try {
      // payload는 이미 JWT 라이브러리에 의해 검증되고 디코딩된 상태
      this.logger.debug(`JWT 페이로드 검증: ${JSON.stringify(payload)}`);

      if (!payload?.sub) {
        this.logger.warn("JWT 페이로드에 sub 필드가 없습니다");
        throw new UnauthorizedException("유효하지 않은 토큰 형식입니다.");
      }

      // role이 단수형으로 존재하는 경우 roles 배열로 변환
      let roles = payload.roles || [];
      if (payload.role && !payload.roles) {
        this.logger.debug(`role '${payload.role}'을 roles 배열로 변환합니다`);
        roles = Array.isArray(payload.role) ? payload.role : [payload.role];
      }
      console.log(roles);
      // 사용자 정보를 반환
      return {
        _id: payload.sub,
        email: payload.email,
        roles: roles,
        ...payload,
      };
    } catch (error) {
      this.logger.error(`JWT 검증 오류: ${error.message}`);
      throw new UnauthorizedException("토큰이 유효하지 않습니다.");
    }
  }
}
