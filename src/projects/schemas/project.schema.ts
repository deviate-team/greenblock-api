import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Types } from 'mongoose';

import { User } from '@/users/schemas/user.schema';
import { IContract } from '@/common/interfaces/contract.interface';
import { ITimePeriod } from '@/common/interfaces/timePeroid.interface';
import { Imember } from '@/common/interfaces/member.interface';
export type ProjectDocument = Project & HydratedDocument<Project>;

@Schema()
export class Project extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false, type: Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop({ required: true, type: Types.ObjectId })
  contract: IContract;

  @Prop({ required: true })
  price_by_unit: number;

  @Prop({ required: true, type: Types.ObjectId })
  time_period: ITimePeriod;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  maximum: number;

  @Prop({ default: 0 })
  amount: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default:null})
  member : [Imember];
  
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
