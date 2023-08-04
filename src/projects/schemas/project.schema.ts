import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Types } from 'mongoose';

import { User } from '@/users/schemas/user.schema';

export type ProjectDocument = Project & HydratedDocument<Project>;

export type ProjectMember = {
  user: string;
  shares: number;
  percentage: number;
  last_payment: Date;
};

@Schema()
export class Project extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop({ required: true, type: Object })
  contract: {
    name: string;
    email: string;
    phoneNumber: string;
  };

  @Prop({ required: true })
  start_date: Date;

  @Prop({ required: true })
  end_date: Date;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  max_shares: number;

  @Prop({ default: 0 })
  balance: number;

  @Prop({ default: [] })
  shares_holders: ProjectMember[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
