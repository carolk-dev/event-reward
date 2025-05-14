import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reward, RewardDocument } from './schemas/reward.schema';
import {
  RewardRequest,
  RewardRequestDocument,
  RewardRequestStatus,
} from './schemas/reward-request.schema';
import { EventsService } from '../events/events.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { RewardRequestDto, RejectRewardRequestDto } from './dto/reward-request.dto';

@Injectable()
export class RewardsService {
  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
    @InjectModel(RewardRequest.name)
    private rewardRequestModel: Model<RewardRequestDocument>,
    private eventsService: EventsService,
  ) {}

  async create(createRewardDto: CreateRewardDto): Promise<Reward> {
    // 이벤트가 존재하는지 확인
    await this.eventsService.findOne(createRewardDto.event);
    
    const createdReward = new this.rewardModel(createRewardDto);
    return createdReward.save();
  }

  async findAll(): Promise<Reward[]> {
    return this.rewardModel.find().populate('event').exec();
  }

  async findOne(id: string): Promise<Reward> {
    const reward = await this.rewardModel.findById(id).populate('event').exec();
    if (!reward) {
      throw new NotFoundException(`ID가 ${id}인 보상을 찾을 수 없습니다.`);
    }
    return reward;
  }

  async update(id: string, updateRewardDto: UpdateRewardDto): Promise<Reward> {
    const updatedReward = await this.rewardModel
      .findByIdAndUpdate(id, updateRewardDto, { new: true })
      .exec();
    if (!updatedReward) {
      throw new NotFoundException(`ID가 ${id}인 보상을 찾을 수 없습니다.`);
    }
    return updatedReward;
  }

  async remove(id: string): Promise<Reward> {
    // 보상 요청이 있는지 확인
    const requests = await this.rewardRequestModel.findOne({ reward: id }).exec();
    if (requests) {
      throw new ConflictException('이 보상을 요청한 사용자가 있어 삭제할 수 없습니다.');
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
    
    // 동일한 사용자가 같은 보상을 이미 요청했는지 확인
    const existingRequest = await this.rewardRequestModel.findOne({
      userId,
      reward: rewardId,
      status: RewardRequestStatus.PENDING,
    }).exec();
    
    if (existingRequest) {
      throw new ConflictException('이미 해당 보상을 요청하셨습니다.');
    }
    
    // 보상 수량이 충분한지 확인
    if (reward.claimed >= reward.quantity) {
      throw new BadRequestException('보상이 모두 소진되었습니다.');
    }
    
    // 이벤트가 활성 상태인지 확인
    const event = await this.eventsService.findOne(reward.event.toString());
    const now = new Date();
    
    if (!event.isActive || now < event.startDate || now > event.endDate) {
      throw new BadRequestException('진행 중인 이벤트가 아닙니다.');
    }
    
    // 보상 요청 생성
    const rewardRequest = new this.rewardRequestModel({
      userId,
      reward: rewardId,
      status: RewardRequestStatus.PENDING,
    });
    
    return rewardRequest.save();
  }

  async approveRewardRequest(id: string): Promise<RewardRequest> {
    const rewardRequest = await this.rewardRequestModel
      .findById(id)
      .populate('reward')
      .exec();
      
    if (!rewardRequest) {
      throw new NotFoundException(`ID가 ${id}인 보상 요청을 찾을 수 없습니다.`);
    }
    
    if (rewardRequest.status !== RewardRequestStatus.PENDING) {
      throw new BadRequestException('이미 처리된 보상 요청입니다.');
    }
    
    const reward = rewardRequest.reward as any;
    
    // 보상 수량이 충분한지 다시 확인
    if (reward.claimed >= reward.quantity) {
      throw new BadRequestException('보상이 모두 소진되었습니다.');
    }
    
    // 보상 수량 업데이트
    await this.rewardModel.findByIdAndUpdate(reward._id, {
      $inc: { claimed: 1 },
    }).exec();
    
    // 보상 요청 상태 업데이트
    rewardRequest.status = RewardRequestStatus.APPROVED;
    rewardRequest.approvedAt = new Date();
    await rewardRequest.save();
    
    return rewardRequest;
  }

  async rejectRewardRequest(id: string, rejectDto: RejectRewardRequestDto): Promise<RewardRequest> {
    const rewardRequest = await this.rewardRequestModel.findById(id).exec();
    
    if (!rewardRequest) {
      throw new NotFoundException(`ID가 ${id}인 보상 요청을 찾을 수 없습니다.`);
    }
    
    if (rewardRequest.status !== RewardRequestStatus.PENDING) {
      throw new BadRequestException('이미 처리된 보상 요청입니다.');
    }
    
    // 보상 요청 상태 업데이트
    rewardRequest.status = RewardRequestStatus.REJECTED;
    rewardRequest.rejectionReason = rejectDto.reason;
    rewardRequest.rejectedAt = new Date();
    
    return rewardRequest.save();
  }

  async findRewardRequestsByUser(userId: string): Promise<RewardRequest[]> {
    return this.rewardRequestModel
      .find({ userId })
      .populate('reward')
      .exec();
  }

  async findAllRewardRequests(): Promise<RewardRequest[]> {
    return this.rewardRequestModel
      .find()
      .populate('reward')
      .exec();
  }

  async findPendingRewardRequests(): Promise<RewardRequest[]> {
    return this.rewardRequestModel
      .find({ status: RewardRequestStatus.PENDING })
      .populate('reward')
      .exec();
  }
} 