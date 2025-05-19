import { Injectable, NotFoundException, BadRequestException, ConflictException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Reward, RewardDocument } from "./schemas/reward.schema";
import { RewardRequest, RewardRequestDocument, RewardRequestStatus } from "./schemas/reward-request.schema";
import { EventsService } from "../events/events.service";
import { CreateRewardDto } from "./dto/create-reward.dto";
import { UpdateRewardDto } from "./dto/update-reward.dto";
import { RewardRequestDto } from "./dto/reward-request.dto";
import { Types } from "mongoose";
@Injectable()
export class RewardsService {
  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
    @InjectModel(RewardRequest.name)
    private rewardRequestModel: Model<RewardRequestDocument>,
    private eventsService: EventsService
  ) {}

  async create(createRewardDto: CreateRewardDto): Promise<Reward> {
    // 이벤트가 존재하는지 확인
    await this.eventsService.findOne(createRewardDto.event);

    const createdReward = new this.rewardModel(createRewardDto);
    return createdReward.save();
  }

  async findAll(): Promise<Reward[]> {
    return this.rewardModel.find().populate("event").exec();
  }

  async findByEventId(eventId: string): Promise<Reward[]> {
    // 먼저 해당 이벤트가 존재하는지 확인
    await this.eventsService.findOne(eventId);

    // 해당 이벤트에 속한 모든 보상 조회
    return this.rewardModel.find({ event: eventId }).populate("event").exec();
  }

  async findRewardsWithFilters(filters: { eventId?: string }): Promise<Reward[]> {
    const { eventId } = filters;
    const query: any = {};

    // 이벤트 ID 필터 추가
    if (eventId) {
      // 먼저 해당 이벤트가 존재하는지 확인
      await this.eventsService.findOne(eventId);
      query.event = eventId;
    }

    // 최종 쿼리 실행
    return this.rewardModel.find(query).populate("event").exec();
  }

  async findOne(id: string): Promise<Reward> {
    const reward = await this.rewardModel.findById(id).populate("event").exec();
    if (!reward) {
      throw new NotFoundException(`ID가 ${id}인 보상을 찾을 수 없습니다.`);
    }
    return reward;
  }

  async update(id: string, updateRewardDto: UpdateRewardDto): Promise<Reward> {
    const updatedReward = await this.rewardModel.findByIdAndUpdate(id, updateRewardDto, { new: true }).exec();
    if (!updatedReward) {
      throw new NotFoundException(`ID가 ${id}인 보상을 찾을 수 없습니다.`);
    }
    return updatedReward;
  }

  async remove(id: string): Promise<Reward> {
    // 보상 요청이 있는지 확인
    const requests = await this.rewardRequestModel.findOne({ reward: id }).exec();
    if (requests) {
      throw new ConflictException("이 보상을 요청한 사용자가 있어 삭제할 수 없습니다.");
    }

    const deletedReward = await this.rewardModel.findByIdAndDelete(id).exec();
    if (!deletedReward) {
      throw new NotFoundException(`ID가 ${id}인 보상을 찾을 수 없습니다.`);
    }
    return deletedReward;
  }

  async requestReward(rewardRequestDto: RewardRequestDto): Promise<RewardRequest> {
    const { userId, rewardId } = rewardRequestDto;

    // 보상이 존재하는지 확인
    const reward = await this.findOne(rewardId);
    // 이벤트 정보 조회
    const now = new Date();

    // 이벤트가 활성 상태인지 확인
    if (!reward.event.isActive || now < reward.event.startDate || now > reward.event.endDate) {
      throw new BadRequestException("진행 중인 이벤트가 아닙니다.");
    }

    // TODO: 사용자가 이벤트 조건을 달성했는지 확인 to 3rd party api

    // 1. 동일한 사용자가 같은 보상에 대해 PENDING 상태의 요청이 있는지 확인
    const existingPendingRequest = await this.rewardRequestModel
      .findOne({
        userId,
        reward: rewardId,
        status: RewardRequestStatus.PENDING,
      })
      .exec();

    if (existingPendingRequest) {
      throw new ConflictException("이미 처리 중인 보상 요청이 있습니다. 승인이 완료될 때까지 기다려주세요.");
    }

    // 2. 동일한 사용자가 같은 보상을 이미 받았는지 확인 (APPROVED 상태)
    const existingApprovedRequest = await this.rewardRequestModel
      .findOne({
        userId,
        reward: rewardId,
        status: RewardRequestStatus.APPROVED,
      })
      .exec();

    if (existingApprovedRequest) {
      throw new ConflictException("이미 해당 보상을 지급받았습니다. 동일한 이벤트에서 중복 보상은 불가능합니다.");
    }

    // 3. 동일한 사용자가 같은 이벤트의 다른 보상을 이미 받았는지 확인 (선택적)
    const otherRewardsFromSameEvent = await this.rewardModel
      .find({
        event: reward.event,
        _id: { $ne: rewardId },
      })
      .exec();

    if (otherRewardsFromSameEvent.length > 0) {
      const otherRewardIds = otherRewardsFromSameEvent.map((r) => r._id);

      const existingApprovedRequestForSameEvent = await this.rewardRequestModel
        .findOne({
          userId,
          reward: { $in: otherRewardIds },
          status: RewardRequestStatus.APPROVED,
        })
        .exec();

      if (existingApprovedRequestForSameEvent) {
        throw new ConflictException(
          "이미 이 이벤트의 다른 보상을 지급받았습니다. 하나의 이벤트에서는 하나의 보상만 받을 수 있습니다."
        );
      }
    }

    // 보상 수량이 충분한지 확인
    if (reward.claimed >= reward.quantity) {
      throw new BadRequestException("보상이 모두 소진되었습니다.");
    }

    // 보상 요청 생성
    const rewardRequest = new this.rewardRequestModel({
      userId,
      reward: rewardId,
      status: RewardRequestStatus.PENDING,
    });

    return rewardRequest.save();
  }

  async findRewardRequestsByUser(userId: string): Promise<RewardRequest[]> {
    return this.rewardRequestModel.find({ userId }).populate("reward").exec();
  }

  async findRewardRequestsByEvent(eventId: string): Promise<RewardRequest[]> {
    // 먼저 해당 이벤트가 존재하는지 확인
    await this.eventsService.findOne(eventId);

    // 해당 이벤트에 속한 모든 보상 ID 조회
    const rewards = await this.rewardModel.find({ event: eventId }).exec();

    if (rewards.length === 0) {
      return [];
    }

    const rewardIds = rewards.map((reward) => reward._id);

    // 해당 보상들에 대한 모든 요청 조회
    return this.rewardRequestModel
      .find({ reward: { $in: rewardIds } })
      .populate("reward")
      .exec();
  }

  async findAllRewardRequests(): Promise<RewardRequest[]> {
    return this.rewardRequestModel.find().populate("reward").exec();
  }

  async findPendingRewardRequests(): Promise<RewardRequest[]> {
    return this.rewardRequestModel.find({ status: RewardRequestStatus.PENDING }).populate("reward").exec();
  }

  async findRewardRequestsByStatus(status?: RewardRequestStatus): Promise<RewardRequest[]> {
    if (!status) {
      return this.findAllRewardRequests();
    }

    return this.rewardRequestModel.find({ status }).populate("reward").exec();
  }

  async findRewardRequestsWithFilters(filters: {
    status?: RewardRequestStatus;
    userId?: string;
    eventId?: string;
  }): Promise<RewardRequest[]> {
    const { status, userId, eventId } = filters;
    const query: any = {};

    // 상태 필터 추가
    if (status) {
      query.status = status;
    }

    // 사용자 ID 필터 추가
    if (userId) {
      query.userId = userId;
    }

    // 이벤트 ID 필터가 있는 경우, 관련 보상 ID들을 찾아 쿼리에 추가
    if (eventId) {
      // 해당 이벤트가 존재하는지 확인
      await this.eventsService.findOne(eventId);

      // 해당 이벤트에 속한 모든 보상 ID 조회
      const rewards = await this.rewardModel.find({ event: eventId }).exec();

      if (rewards.length === 0) {
        return []; // 보상이 없으면 빈 배열 반환
      }

      const rewardIds = rewards.map((reward) => reward._id);
      query.reward = { $in: rewardIds };
    }

    // 최종 쿼리 실행
    return this.rewardRequestModel.find(query).populate("reward").exec();
  }
}
