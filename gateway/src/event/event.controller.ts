import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller()
export class EventController {
  constructor(private eventService: EventService) {}

  // 이벤트 관련 API
  @Get('events')
  async getAllEvents() {
    return this.eventService.getAllEvents();
  }

  @Get('events/:id')
  async getEventById(@Param('id') id: string) {
    return this.eventService.getEventById(id);
  }

  @Post('events')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createEvent(@Body() eventData: any) {
    return this.eventService.createEvent(eventData);
  }

  @Put('events/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateEvent(@Param('id') id: string, @Body() eventData: any) {
    return this.eventService.updateEvent(id, eventData);
  }

  @Delete('events/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteEvent(@Param('id') id: string) {
    return this.eventService.deleteEvent(id);
  }

  // 보상 관련 API
  @Get('rewards')
  async getAllRewards() {
    return this.eventService.getAllRewards();
  }

  @Get('rewards/:id')
  async getRewardById(@Param('id') id: string) {
    return this.eventService.getRewardById(id);
  }

  @Post('rewards')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createReward(@Body() rewardData: any) {
    return this.eventService.createReward(rewardData);
  }

  @Post('rewards/request')
  @UseGuards(JwtAuthGuard)
  async requestReward(@Body() requestData: { userId: string; rewardId: string }) {
    return this.eventService.requestReward(requestData.userId, requestData.rewardId);
  }

  @Post('rewards/approve/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'auditor')
  async approveReward(@Param('id') id: string) {
    return this.eventService.approveReward(id);
  }

  @Post('rewards/reject/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'auditor')
  async rejectReward(@Param('id') id: string, @Body() rejectData: { reason: string }) {
    return this.eventService.rejectReward(id, rejectData.reason);
  }
} 