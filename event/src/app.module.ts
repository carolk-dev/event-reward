import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { EventsModule } from "./events/events.module";
import { RewardsModule } from "./rewards/rewards.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri =
          configService.get<string>("MONGODB_URI") || "mongodb://root:password@localhost:27017/event?authSource=admin";
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
export class AppModule {}
