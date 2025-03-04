import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

// export type UserDocument = HydratedDocument<User> & {
//   validatePassword(password: string): Promise<boolean>;
// };

@Schema()
export class User {
  @Prop({
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  })
  customId?: string;

  @Prop({ required: true })
  name?: string;

  @Prop({ required: true, enum: ['admin', 'professor', 'student', 'user'] })
  role!: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
    default: [],
  })
  groups!: string[];

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tournament' }],
    default: [],
  })
  tournaments!: string[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  friends!: string[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  followers!: string[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  following!: string[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
    default: [],
  })
  games!: string[];

  @Prop({ type: String, default: '' })
  photoUrl?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
