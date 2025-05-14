import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Event } from '../../events/schemas/event.schema';

export type RewardDocument = Reward & Document;

@Schema({
  timestamps: true,
})
export class Reward {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ default: 0 })
  claimed: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Event', required: true })
  event: Event;
}

export const RewardSchema = SchemaFactory.createForClass(Reward); 