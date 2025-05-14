import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { RewardRequestDto, RejectRewardRequestDto } from './dto/reward-request.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller()
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Post('rewards')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async create(@Body() createRewardDto: CreateRewardDto) {
    return this.rewardsService.create(createRewardDto);
  }

  @Get('rewards')
  async findAll() {
    return this.rewardsService.findAll();
  }

  @Get('rewards/:id')
  async findOne(@Param('id') id: string) {
    return this.rewardsService.findOne(id);
  }

  @Put('rewards/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() updateRewardDto: UpdateRewardDto,
  ) {
    return this.rewardsService.update(id, updateRewardDto);
  }

  @Delete('rewards/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return this.rewardsService.remove(id);
  }

  @Post('rewards/request')
  @UseGuards(AuthGuard)
  async requestReward(@Body() rewardRequestDto: RewardRequestDto) {
    return this.rewardsService.requestReward(rewardRequestDto);
  }

  @Post('rewards/approve/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'auditor')
  async approveReward(@Param('id') id: string) {
    return this.rewardsService.approveRewardRequest(id);
  }

  @Post('rewards/reject/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'auditor')
  async rejectReward(
    @Param('id') id: string,
    @Body() rejectDto: RejectRewardRequestDto,
  ) {
    return this.rewardsService.rejectRewardRequest(id, rejectDto);
  }

  @Get('rewards/requests/user/:userId')
  @UseGuards(AuthGuard)
  async findRewardRequestsByUser(@Param('userId') userId: string) {
    return this.rewardsService.findRewardRequestsByUser(userId);
  }

  @Get('rewards/requests/all')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'auditor')
  async findAllRewardRequests() {
    return this.rewardsService.findAllRewardRequests();
  }

  @Get('rewards/requests/pending')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'auditor')
  async findPendingRewardRequests() {
    return this.rewardsService.findPendingRewardRequests();
  }
} 