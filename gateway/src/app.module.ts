import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { EventModule } from "./event/event.module";
import { AuthMiddleware } from "./common/middleware/auth.middleware";
import { LoggingMiddleware } from "./common/middleware/logging.middleware";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    EventModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 로깅 미들웨어를 먼저 적용
    consumer.apply(LoggingMiddleware).forRoutes("*");

    // 인증 미들웨어 적용
    consumer.apply(AuthMiddleware).forRoutes("*");
  }
}
