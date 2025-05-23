import { Controller, Get, Post, Body, Param, Delete, Put, Query } from "@nestjs/common";
import { RewardsService } from "./rewards.service";
import { CreateRewardDto } from "./dto/create-reward.dto";
import { UpdateRewardDto } from "./dto/update-reward.dto";
import { RewardRequestDto } from "./dto/reward-request.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { RewardRequestStatus } from "./schemas/reward-request.schema";

@ApiTags("Rewards")
@Controller("rewards")
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @ApiOperation({ summary: "보상 생성", description: "새로운 보상을 생성합니다." })
  @ApiResponse({ status: 201, description: "보상이 성공적으로 생성되었습니다." })
  @Post()
  async create(@Body() createRewardDto: CreateRewardDto) {
    return this.rewardsService.create(createRewardDto);
  }

  @ApiOperation({
    summary: "모든 보상 조회",
    description: "모든 보상 목록을 조회합니다. eventId가 제공되면 해당 이벤트의 보상만 조회합니다.",
  })
  @ApiResponse({ status: 200, description: "보상 목록이 성공적으로 조회되었습니다." })
  @ApiQuery({
    name: "eventId",
    required: false,
    description: "조회할 이벤트 ID",
    type: String,
  })
  @Get()
  async findAll(@Query("eventId") eventId?: string) {
    return this.rewardsService.findRewardsWithFilters({ eventId });
  }

  @ApiOperation({ summary: "특정 보상 조회", description: "ID로 특정 보상을 조회합니다." })
  @ApiResponse({ status: 200, description: "보상이 성공적으로 조회되었습니다." })
  @ApiResponse({ status: 404, description: "보상을 찾을 수 없습니다." })
  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.rewardsService.findOne(id);
  }

  @ApiOperation({ summary: "보상 수정", description: "특정 보상 정보를 수정합니다." })
  @ApiResponse({ status: 200, description: "보상이 성공적으로 수정되었습니다." })
  @ApiResponse({ status: 404, description: "보상을 찾을 수 없습니다." })
  @Put(":id")
  async update(@Param("id") id: string, @Body() updateRewardDto: UpdateRewardDto) {
    return this.rewardsService.update(id, updateRewardDto);
  }

  @ApiOperation({ summary: "보상 삭제", description: "특정 보상을 삭제합니다." })
  @ApiResponse({ status: 200, description: "보상이 성공적으로 삭제되었습니다." })
  @ApiResponse({ status: 404, description: "보상을 찾을 수 없습니다." })
  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.rewardsService.remove(id);
  }
}

@ApiTags("Reward Requests")
@Controller("reward-requests")
export class RewardRequestsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @ApiOperation({
    summary: "보상 요청",
    description:
      "사용자가 특정 보상을 요청합니다. 요청과 동시에 모든 조건이 검증되고, 조건 충족 시 보상이 즉시 발송됩니다. 상태는 자동으로 approved 또는 rejected로 설정됩니다.",
  })
  @ApiResponse({ status: 201, description: "보상 요청이 성공적으로 처리되었습니다." })
  @ApiResponse({ status: 400, description: "잘못된 요청 형식입니다." })
  @Post()
  async requestReward(@Body() rewardRequestDto: RewardRequestDto) {
    return this.rewardsService.requestReward(rewardRequestDto);
  }

  @ApiOperation({
    summary: "상태별 보상 요청 조회",
    description: "특정 상태의 보상 요청을 조회합니다. 상태를 지정하지 않으면 모든 보상 요청을 조회합니다.",
  })
  @ApiResponse({ status: 200, description: "보상 요청 목록이 성공적으로 조회되었습니다." })
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
  @Get()
  async findRewardRequestsByStatus(
    @Query("status") status?: RewardRequestStatus,
    @Query("eventId") eventId?: string,
    @Query("userId") userId?: string
  ) {
    return this.rewardsService.findRewardRequestsWithFilters({
      status,
      eventId,
      userId,
    });
  }
}
