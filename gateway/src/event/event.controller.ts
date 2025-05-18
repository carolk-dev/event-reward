import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Query } from "@nestjs/common";
import { EventService } from "./event.service";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRole } from "../common/constants/roles";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import {
  CreateEventDto,
  CreateRewardDto,
  RewardRequestDto,
  RewardRequestStatus,
  UpdateRewardDto,
  UpdateEventDto,
} from "./event.dto";
import { AuthGuard } from "../common/guards/auth.guard";

// 이벤트 관련 API

@ApiTags("Events")
@Controller("events")
export class EventController {
  constructor(private eventService: EventService) {}

  @ApiOperation({
    summary: "이벤트 조회",
    description: "모든 이벤트를 조회하거나 활성화된 이벤트만 필터링하여 조회합니다.",
  })
  @ApiResponse({ status: 200, description: "이벤트 목록 조회 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiQuery({
    name: "active",
    required: false,
    type: Boolean,
    description: "활성화된 이벤트만 조회할지 여부(true/false)",
  })
  @ApiBearerAuth()
  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  async getAllEvents(@Query("active") active?: string) {
    if (active === "true") {
      return this.eventService.getActiveEvents();
    }
    return this.eventService.getAllEvents();
  }

  @ApiOperation({ summary: "특정 이벤트 조회" })
  @ApiResponse({ status: 200, description: "이벤트 조회 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiResponse({ status: 404, description: "이벤트를 찾을 수 없음" })
  @ApiBearerAuth()
  @Get(":id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  async getEventById(@Param("id") id: string) {
    return this.eventService.getEventById(id);
  }

  @ApiOperation({ summary: "새 이벤트 생성" })
  @ApiResponse({ status: 201, description: "이벤트 생성 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiResponse({ status: 400, description: "잘못된 요청" })
  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  async createEvent(@Body() eventData: CreateEventDto) {
    return this.eventService.createEvent(eventData);
  }

  @ApiOperation({ summary: "이벤트 수정" })
  @ApiResponse({ status: 200, description: "이벤트 수정 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiResponse({ status: 404, description: "이벤트를 찾을 수 없음" })
  @ApiBearerAuth()
  @Put(":id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  async updateEvent(@Param("id") id: string, @Body() eventData: UpdateEventDto) {
    return this.eventService.updateEvent(id, eventData);
  }

  @ApiOperation({ summary: "이벤트 삭제" })
  @ApiResponse({ status: 200, description: "이벤트 삭제 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiResponse({ status: 404, description: "이벤트를 찾을 수 없음" })
  @ApiBearerAuth()
  @Delete(":id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteEvent(@Param("id") id: string) {
    return this.eventService.deleteEvent(id);
  }
}

// 보상 및 보상 요청 관련 API
@ApiTags("Rewards")
@Controller("rewards")
export class RewardController {
  constructor(private eventService: EventService) {}

  @ApiOperation({ summary: "모든 보상 조회" })
  @ApiResponse({ status: 200, description: "보상 목록 조회 성공" })
  @ApiQuery({
    name: "eventId",
    required: false,
    type: String,
    description: "특정 이벤트의 보상만 조회할 이벤트 ID",
  })
  @Get()
  async getAllRewards(@Query("eventId") eventId?: string) {
    if (eventId) {
      return this.eventService.getRewardsByEventId(eventId);
    }
    return this.eventService.getAllRewards();
  }

  @ApiOperation({ summary: "특정 보상 조회" })
  @ApiResponse({ status: 200, description: "보상 조회 성공" })
  @ApiResponse({ status: 404, description: "보상을 찾을 수 없음" })
  @Get(":id")
  async getRewardById(@Param("id") id: string) {
    return this.eventService.getRewardById(id);
  }

  @ApiOperation({ summary: "새 보상 생성" })
  @ApiResponse({ status: 201, description: "보상 생성 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiResponse({ status: 400, description: "잘못된 요청" })
  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  async createReward(@Body() rewardData: CreateRewardDto) {
    return this.eventService.createReward(rewardData);
  }

  @ApiOperation({ summary: "보상 수정" })
  @ApiResponse({ status: 200, description: "보상 수정 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiResponse({ status: 404, description: "보상을 찾을 수 없음" })
  @ApiBearerAuth()
  @Put(":id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  async updateReward(@Param("id") id: string, @Body() rewardData: UpdateRewardDto) {
    return this.eventService.updateReward(id, rewardData);
  }

  @ApiOperation({ summary: "보상 삭제" })
  @ApiResponse({ status: 200, description: "보상 삭제 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiResponse({ status: 404, description: "보상을 찾을 수 없음" })
  @ApiBearerAuth()
  @Delete(":id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteReward(@Param("id") id: string) {
    return this.eventService.deleteReward(id);
  }

  @ApiOperation({ summary: "보상 요청" })
  @ApiResponse({ status: 201, description: "보상 요청 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiResponse({ status: 400, description: "잘못된 요청 또는 중복 요청" })
  @ApiBearerAuth()
  @Post("request")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  async requestReward(@Body() requestData: RewardRequestDto) {
    return this.eventService.requestReward(requestData.userId, requestData.rewardId);
  }

  @ApiOperation({
    summary: "상태별 보상 요청 조회",
    description: "특정 상태의 보상 요청을 조회합니다. 상태가 빈값이면 모든 보상 요청을 조회합니다.",
  })
  @ApiResponse({ status: 200, description: "보상 요청 목록이 성공적으로 조회되었습니다." })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiBearerAuth()
  @ApiQuery({
    name: "status",
    enum: RewardRequestStatus,
    required: false,
    description: "조회할 보상 요청의 상태 (pending, approved, rejected)",
  })
  @ApiQuery({
    name: "eventId",
    required: false,
    type: String,
    description: "특정 이벤트의 보상 요청만 조회할 이벤트 ID",
  })
  @ApiQuery({
    name: "userId",
    required: false,
    type: String,
    description: "특정 사용자의 보상 요청만 조회할 사용자 ID",
  })
  @Get("requests")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.AUDITOR, UserRole.OPERATOR, UserRole.ADMIN)
  async getRewardRequestsByStatus(
    @Query("status") status?: RewardRequestStatus,
    @Query("eventId") eventId?: string,
    @Query("userId") userId?: string
  ) {
    if (userId) {
      return this.eventService.getUserRewardRequests(userId);
    }
    if (eventId) {
      return this.eventService.getRewardRequestsByEvent(eventId);
    }
    return this.eventService.getRewardRequestsByStatus(status);
  }
}
