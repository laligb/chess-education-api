import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User> & {
  validatePassword(password: string): Promise<boolean>;
};

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop({ required: true, enum: ['admin', 'professor', 'student'] })
  role: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
    default: [],
  })
  groups: string[];

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
