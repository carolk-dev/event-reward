import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthController, UsersController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwtSecret = configService.get<string>("JWT_SECRET") || "default_secret_key_for_development";
        return {
          secret: jwtSecret,
        };
      },
    }),
  ],
  controllers: [AuthController, UsersController],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
