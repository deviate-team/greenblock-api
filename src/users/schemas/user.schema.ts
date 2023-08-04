import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';
import { Role } from '@/common/enums/role.enum';

export type UserDocument = User & HydratedDocument<User>;

@Schema()
export class User extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  firstName: string;

  @Prop()
  middleName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
  })
  birthDate: Date;

  @Prop({
    required: true,
  })
  phoneNumber: string;

  @Prop({
    default:
      'https://static.vecteezy.com/system/resources/previews/000/511/437/original/travel-tourism-logo-isolated-on-white-background-vector.jpg', // TODO: change default image
  })
  imageProfile: string;

  @Prop({ required: true, enum: Role, default: Role.User })
  role: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
