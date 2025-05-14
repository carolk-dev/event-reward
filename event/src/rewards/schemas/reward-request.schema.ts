import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Reward } from './reward.schema';

export type RewardRequestDocument = RewardRequest & Document;

export enum RewardRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Schema({
  timestamps: true,
})
export class RewardRequest {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Reward', required: true })
  reward: Reward;

  @Prop({ 
    type: String, 
    enum: RewardRequestStatus, 
    default: RewardRequestStatus.PENDING 
  })
  status: RewardRequestStatus;

  @Prop()
  rejectionReason?: string;

  @Prop()
  approvedAt?: Date;

  @Prop()
  rejectedAt?: Date;
}

export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest); 