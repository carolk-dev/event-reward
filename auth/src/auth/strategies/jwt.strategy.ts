import { Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private configService: ConfigService) {
    const jwtSecret = configService.get<string>("JWT_SECRET");

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });

    Logger.log(`JWT Strategy configured with secret: ${jwtSecret ? "Yes" : "No"}`, JwtStrategy.name);
  }

  async validate(payload: any) {
    this.logger.debug(`JWT 전략 페이로드: ${JSON.stringify(payload)}`);

    const user = {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    this.logger.debug(`반환된 사용자 정보: ${JSON.stringify(user)}`);

    return user;
  }
}
