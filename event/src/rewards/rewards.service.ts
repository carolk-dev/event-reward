import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Reward, RewardDocument } from "./schemas/reward.schema";
import { RewardRequest, RewardRequestDocument, RewardRequestStatus } from "./schemas/reward-request.schema";
import { EventsService } from "../events/events.service";
import { CreateRewardDto } from "./dto/create-reward.dto";
import { UpdateRewardDto } from "./dto/update-reward.dto";
import { RewardRequestDto } from "./dto/reward-request.dto";
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

    // 먼저 요청을 PENDING 상태로 생성하고 DB에 저장
    const rewardRequest = new this.rewardRequestModel({
      userId,
      reward: rewardId,
      status: RewardRequestStatus.PENDING,
    });

    const savedRequest = await rewardRequest.save();

    try {
      // 1. 이벤트 참여 조건을 만족하는지 외부 API 호출로 검증
      const reward = await this.findOne(rewardId);
      const eventId = reward.event.toString(); // Mongoose ObjectId를 문자열로 변환
      const isEventConditionMet = await this.verifyEventConditions(userId, eventId);

      if (!isEventConditionMet) {
        return this.updateRequestStatus(
          savedRequest._id,
          RewardRequestStatus.REJECTED,
          "이벤트 참여 조건을 충족하지 않습니다."
        );
      }

      // 2. 보상이 존재하는지 확인
      const now = new Date();

      // 3. 이벤트가 활성 상태인지 확인
      if (!reward.event.isActive || now < reward.event.startDate || now > reward.event.endDate) {
        return this.updateRequestStatus(savedRequest._id, RewardRequestStatus.REJECTED, "진행 중인 이벤트가 아닙니다.");
      }

      // 4. 동일한 사용자가 같은 보상에 대해 APPROVED 상태의 요청이 있는지 확인
      const existingApprovedRequest = await this.rewardRequestModel
        .findOne({
          userId,
          reward: rewardId,
          status: RewardRequestStatus.APPROVED,
          _id: { $ne: savedRequest._id }, // 현재 요청 제외
        })
        .exec();

      if (existingApprovedRequest) {
        return this.updateRequestStatus(
          savedRequest._id,
          RewardRequestStatus.REJECTED,
          "이미 해당 보상을 지급받았습니다. 동일한 이벤트에서 중복 보상은 불가능합니다."
        );
      }

      // 5. 동일한 사용자가 같은 이벤트의 다른 보상을 이미 받았는지 확인
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
          return this.updateRequestStatus(
            savedRequest._id,
            RewardRequestStatus.REJECTED,
            "이미 이 이벤트의 다른 보상을 지급받았습니다. 하나의 이벤트에서는 하나의 보상만 받을 수 있습니다."
          );
        }
      }

      // 6. 보상 수량이 충분한지 확인
      if (reward.claimed >= reward.quantity) {
        return this.updateRequestStatus(savedRequest._id, RewardRequestStatus.REJECTED, "보상이 모두 소진되었습니다.");
      }

      // 7. 사용자 자격 조건 검증
      const isUserQualified = await this.verifyUserQualification(userId, reward);

      if (!isUserQualified) {
        return this.updateRequestStatus(
          savedRequest._id,
          RewardRequestStatus.REJECTED,
          "사용자가 보상 조건을 충족하지 않습니다."
        );
      }

      // 8. 외부 보상 발송 API 호출
      const isRewardSent = await this.sendReward(userId, reward);

      if (!isRewardSent) {
        return this.updateRequestStatus(savedRequest._id, RewardRequestStatus.REJECTED, "보상 발송에 실패했습니다.");
      }

      // 9. 보상 발송 성공 시 상태를 approved로 업데이트하고 보상 수량 증가
      const rewardDoc = await this.rewardModel.findById(rewardId).exec();
      rewardDoc.claimed += 1;
      await rewardDoc.save();

      return this.updateRequestStatus(savedRequest._id, RewardRequestStatus.APPROVED, null, new Date());
    } catch (error) {
      // 에러 발생 시 요청 상태를 rejected로 업데이트
      return this.updateRequestStatus(
        savedRequest._id,
        RewardRequestStatus.REJECTED,
        `처리 중 오류가 발생했습니다: ${error.message}`
      );
    }
  }

  /**
   * 요청 상태 업데이트 헬퍼 메서드
   */
  private async updateRequestStatus(
    requestId: any,
    status: RewardRequestStatus,
    rejectionReason?: string,
    approvedAt?: Date
  ): Promise<RewardRequest> {
    const updateData: any = { status };

    if (status === RewardRequestStatus.REJECTED) {
      updateData.rejectionReason = rejectionReason;
      updateData.rejectedAt = new Date();
    } else if (status === RewardRequestStatus.APPROVED) {
      updateData.approvedAt = approvedAt || new Date();
    }

    return this.rewardRequestModel.findByIdAndUpdate(requestId, updateData, { new: true }).populate("reward").exec();
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

  /**
   * 사용자 자격 조건 검증 메서드 (외부 서비스 호출 가정)
   */
  private async verifyUserQualification(_userId: string, _reward: Reward): Promise<boolean> {
    // 실제 구현에서는 외부 API 호출 또는 다른 검증 로직 구현
    // 예시로 모든 사용자 조건 만족으로 간주
    return true;
  }

  /**
   * 외부 이벤트 조건 검증 API 호출 메서드
   */
  private async verifyEventConditions(userId: string, eventId: string): Promise<boolean> {
    try {
      // 실제 구현시 외부 API 호출 (예: 이벤트 조건 검증 시스템)
      console.log(`이벤트 조건 검증: 사용자 ${userId}가 이벤트 ${eventId}의 참여 조건을 만족하는지 확인`);

      // 외부 API 호출 성공 가정
      // 실제 구현에서는 외부 API 응답에 따라 true/false 반환
      return true;
    } catch (error) {
      console.error("이벤트 조건 검증 실패:", error);
      return false;
    }
  }

  /**
   * 외부 보상 발송 API 호출 메서드
   */
  private async sendReward(userId: string, reward: Reward): Promise<boolean> {
    try {
      // 실제 구현시 외부 API 호출 (예: 보상 지급 시스템, 포인트 시스템 등)
      console.log(`보상 발송: 사용자 ${userId}에게 ${reward.name} 지급`);

      // 외부 API 호출 성공 가정
      return true;
    } catch (error) {
      console.error("보상 발송 실패:", error);
      return false;
    }
  }
}
