import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { EventsModule } from "./events/events.module";
import { RewardsModule } from "./rewards/rewards.module";
import { LoggingMiddleware } from "./common/middleware/logging.middleware";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = `${configService.get<string>("MONGO_URI")}`;
        console.log("MongoDB URI:", uri); // 디버깅용
        return {
          uri,
        };
      },
    }),
    EventsModule,
    RewardsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes("*");
  }
}
