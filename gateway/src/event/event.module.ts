import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventController, RewardController, RewardRequestController } from "./event.controller";
import { EventService } from "./event.service";

@Module({
  imports: [ConfigModule],
  controllers: [EventController, RewardController, RewardRequestController],
  providers: [EventService],
})
export class EventModule {}
