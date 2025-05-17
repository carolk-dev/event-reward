import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { EventService } from "./event.service";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRole } from "../common/constants/roles";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { CreateEventDto, CreateRewardDto, RewardRequestDto, RejectRewardRequestDto } from "./event.dto";
import { AuthGuard } from "../common/guards/auth.guard";

// 이벤트 관련 API
@ApiTags("이벤트")
@Controller("events")
export class EventController {
  constructor(private eventService: EventService) {}

  @ApiOperation({ summary: "모든 이벤트 조회" })
  @ApiResponse({ status: 200, description: "이벤트 목록 조회 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiBearerAuth()
  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  async getAllEvents() {
    return this.eventService.getAllEvents();
  }

  @ApiOperation({ summary: "공개 이벤트 목록 조회" })
  @ApiResponse({ status: 200, description: "공개 이벤트 목록 조회 성공" })
  @Get("/public")
  async getPublicEvents() {
    return this.eventService.getPublicEvents();
  }

  @ApiOperation({ summary: "활성화된 이벤트 목록 조회" })
  @ApiResponse({ status: 200, description: "활성화된 이벤트 목록 조회 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiBearerAuth()
  @Get("/active")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  async getActiveEvents() {
    return this.eventService.getActiveEvents();
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
  async updateEvent(@Param("id") id: string, @Body() eventData: CreateEventDto) {
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
@ApiTags("보상")
@Controller("rewards")
export class RewardController {
  constructor(private eventService: EventService) {}

  @ApiOperation({ summary: "모든 보상 조회" })
  @ApiResponse({ status: 200, description: "보상 목록 조회 성공" })
  @Get()
  async getAllRewards() {
    return this.eventService.getAllRewards();
  }

  @ApiOperation({ summary: "특정 보상 조회" })
  @ApiResponse({ status: 200, description: "보상 조회 성공" })
  @ApiResponse({ status: 404, description: "보상을 찾을 수 없음" })
  @Get(":id")
  async getRewardById(@Param("id") id: string) {
    return this.eventService.getRewardById(id);
  }

  @ApiOperation({ summary: "이벤트별 보상 조회" })
  @ApiResponse({ status: 200, description: "이벤트별 보상 조회 성공" })
  @ApiResponse({ status: 404, description: "이벤트를 찾을 수 없음" })
  @Get("event/:eventId")
  async getRewardsByEventId(@Param("eventId") eventId: string) {
    return this.eventService.getRewardsByEventId(eventId);
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
  async updateReward(@Param("id") id: string, @Body() rewardData: CreateRewardDto) {
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

  @ApiOperation({ summary: "보상 요청 승인" })
  @ApiResponse({ status: 200, description: "보상 요청 승인 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiResponse({ status: 404, description: "보상 요청을 찾을 수 없음" })
  @ApiBearerAuth()
  @Post("approve/:id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  async approveReward(@Param("id") id: string) {
    return this.eventService.approveReward(id);
  }

  @ApiOperation({ summary: "보상 요청 거절" })
  @ApiResponse({ status: 200, description: "보상 요청 거절 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiResponse({ status: 404, description: "보상 요청을 찾을 수 없음" })
  @ApiBearerAuth()
  @Post("reject/:id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  async rejectReward(@Param("id") id: string, @Body() rejectData: RejectRewardRequestDto) {
    return this.eventService.rejectReward(id, rejectData.reason);
  }

  @ApiOperation({ summary: "모든 보상 요청 이력 조회" })
  @ApiResponse({ status: 200, description: "보상 요청 이력 조회 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiBearerAuth()
  @Get("requests/all")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.AUDITOR, UserRole.OPERATOR, UserRole.ADMIN)
  async getAllRewardRequests() {
    return this.eventService.getAllRewardRequests();
  }

  @ApiOperation({ summary: "대기 중인 보상 요청 조회" })
  @ApiResponse({ status: 200, description: "대기 중인 보상 요청 조회 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiBearerAuth()
  @Get("requests/pending")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.AUDITOR, UserRole.OPERATOR, UserRole.ADMIN)
  async getPendingRewardRequests() {
    return this.eventService.getPendingRewardRequests();
  }

  @ApiOperation({ summary: "승인된 보상 요청 조회" })
  @ApiResponse({ status: 200, description: "승인된 보상 요청 조회 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiBearerAuth()
  @Get("requests/approved")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.AUDITOR, UserRole.OPERATOR, UserRole.ADMIN)
  async getApprovedRewardRequests() {
    return this.eventService.getApprovedRewardRequests();
  }

  @ApiOperation({ summary: "거절된 보상 요청 조회" })
  @ApiResponse({ status: 200, description: "거절된 보상 요청 조회 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiBearerAuth()
  @Get("requests/rejected")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.AUDITOR, UserRole.OPERATOR, UserRole.ADMIN)
  async getRejectedRewardRequests() {
    return this.eventService.getRejectedRewardRequests();
  }

  @ApiOperation({ summary: "특정 사용자의 보상 요청 이력 조회" })
  @ApiResponse({ status: 200, description: "사용자 보상 요청 이력 조회 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 404, description: "사용자를 찾을 수 없음" })
  @ApiBearerAuth()
  @Get("requests/user/:userId")
  @UseGuards(AuthGuard)
  async getUserRewardRequests(@Param("userId") userId: string) {
    return this.eventService.getUserRewardRequests(userId);
  }

  @ApiOperation({ summary: "특정 이벤트의 보상 요청 이력 조회" })
  @ApiResponse({ status: 200, description: "이벤트 보상 요청 이력 조회 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiResponse({ status: 404, description: "이벤트를 찾을 수 없음" })
  @ApiBearerAuth()
  @Get("requests/event/:eventId")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.AUDITOR, UserRole.OPERATOR, UserRole.ADMIN)
  async getRewardRequestsByEvent(@Param("eventId") eventId: string) {
    return this.eventService.getRewardRequestsByEvent(eventId);
  }

  @ApiOperation({ summary: "특정 보상 요청 조회" })
  @ApiResponse({ status: 200, description: "보상 요청 조회 성공" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 403, description: "권한 없음" })
  @ApiResponse({ status: 404, description: "보상 요청을 찾을 수 없음" })
  @ApiBearerAuth()
  @Get("requests/:requestId")
  @UseGuards(AuthGuard)
  async getRewardRequestById(@Param("requestId") requestId: string) {
    return this.eventService.getRewardRequestById(requestId);
  }
}
