import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
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

  async validate(request: any, payload: any) {
    try {
      const token = request.headers.authorization.split(" ")[1];

      const user = await this.authService.validateUser(token);

      if (!user) {
        throw new UnauthorizedException("사용자가 인증되지 않았습니다.");
      }
      return user;
    } catch (error) {
      console.error("JWT 검증 오류:", error.message);
      throw new UnauthorizedException("토큰이 유효하지 않습니다.");
    }
  }
}
