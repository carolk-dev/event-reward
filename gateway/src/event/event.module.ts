import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventController } from './event.controller';
import { EventService } from './event.service';

@Module({
  imports: [ConfigModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {} 