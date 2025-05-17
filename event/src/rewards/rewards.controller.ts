import { Controller, Get, Post, Body, Param, Delete, Put } from "@nestjs/common";
import { RewardsService } from "./rewards.service";
import { CreateRewardDto } from "./dto/create-reward.dto";
import { UpdateRewardDto } from "./dto/update-reward.dto";
import { RewardRequestDto, RejectRewardRequestDto } from "./dto/reward-request.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("Rewards")
@ApiBearerAuth()
@Controller()
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @ApiOperation({ summary: "보상 생성", description: "새로운 보상을 생성합니다." })
  @ApiResponse({ status: 201, description: "보상이 성공적으로 생성되었습니다." })
  @Post("rewards")
  async create(@Body() createRewardDto: CreateRewardDto) {
    return this.rewardsService.create(createRewardDto);
  }

  @ApiOperation({ summary: "모든 보상 조회", description: "모든 보상 목록을 조회합니다." })
  @ApiResponse({ status: 200, description: "보상 목록이 성공적으로 조회되었습니다." })
  @Get("rewards")
  async findAll() {
    return this.rewardsService.findAll();
  }

  @ApiOperation({ summary: "특정 보상 조회", description: "ID로 특정 보상을 조회합니다." })
  @ApiResponse({ status: 200, description: "보상이 성공적으로 조회되었습니다." })
  @ApiResponse({ status: 404, description: "보상을 찾을 수 없습니다." })
  @Get("rewards/:id")
  async findOne(@Param("id") id: string) {
    return this.rewardsService.findOne(id);
  }

  @ApiOperation({ summary: "보상 수정", description: "특정 보상 정보를 수정합니다." })
  @ApiResponse({ status: 200, description: "보상이 성공적으로 수정되었습니다." })
  @ApiResponse({ status: 404, description: "보상을 찾을 수 없습니다." })
  @Put("rewards/:id")
  async update(@Param("id") id: string, @Body() updateRewardDto: UpdateRewardDto) {
    return this.rewardsService.update(id, updateRewardDto);
  }

  @ApiOperation({ summary: "보상 삭제", description: "특정 보상을 삭제합니다." })
  @ApiResponse({ status: 200, description: "보상이 성공적으로 삭제되었습니다." })
  @ApiResponse({ status: 404, description: "보상을 찾을 수 없습니다." })
  @Delete("rewards/:id")
  async remove(@Param("id") id: string) {
    return this.rewardsService.remove(id);
  }

  @ApiOperation({ summary: "보상 요청", description: "사용자가 특정 보상을 요청합니다." })
  @ApiResponse({ status: 201, description: "보상 요청이 성공적으로 생성되었습니다." })
  @ApiResponse({ status: 400, description: "잘못된 요청 형식입니다." })
  @Post("rewards/request")
  async requestReward(@Body() rewardRequestDto: RewardRequestDto) {
    return this.rewardsService.requestReward(rewardRequestDto);
  }

  @ApiOperation({ summary: "보상 요청 승인", description: "관리자가 보상 요청을 승인합니다." })
  @ApiResponse({ status: 200, description: "보상 요청이 성공적으로 승인되었습니다." })
  @ApiResponse({ status: 404, description: "보상 요청을 찾을 수 없습니다." })
  @Post("rewards/approve/:id")
  async approveReward(@Param("id") id: string) {
    return this.rewardsService.approveRewardRequest(id);
  }

  @ApiOperation({ summary: "보상 요청 거절", description: "관리자가 보상 요청을 거절합니다." })
  @ApiResponse({ status: 200, description: "보상 요청이 성공적으로 거절되었습니다." })
  @ApiResponse({ status: 404, description: "보상 요청을 찾을 수 없습니다." })
  @Post("rewards/reject/:id")
  async rejectReward(@Param("id") id: string, @Body() rejectDto: RejectRewardRequestDto) {
    return this.rewardsService.rejectRewardRequest(id, rejectDto);
  }

  @ApiOperation({ summary: "사용자별 보상 요청 조회", description: "특정 사용자의 모든 보상 요청을 조회합니다." })
  @ApiResponse({ status: 200, description: "보상 요청 목록이 성공적으로 조회되었습니다." })
  @Get("rewards/requests/user/:userId")
  async findRewardRequestsByUser(@Param("userId") userId: string) {
    return this.rewardsService.findRewardRequestsByUser(userId);
  }

  @ApiOperation({ summary: "모든 보상 요청 조회", description: "모든 보상 요청을 조회합니다." })
  @ApiResponse({ status: 200, description: "보상 요청 목록이 성공적으로 조회되었습니다." })
  @Get("rewards/requests/all")
  async findAllRewardRequests() {
    return this.rewardsService.findAllRewardRequests();
  }

  @ApiOperation({ summary: "대기 중인 보상 요청 조회", description: "승인 대기 중인 보상 요청을 조회합니다." })
  @ApiResponse({ status: 200, description: "대기 중인 보상 요청 목록이 성공적으로 조회되었습니다." })
  @Get("rewards/requests/pending")
  async findPendingRewardRequests() {
    return this.rewardsService.findPendingRewardRequests();
  }
}
