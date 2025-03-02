import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/user/user.schema';
import { Location, LocationSchema } from './location.schema';
import { Round } from './round.schema';

@Schema()
export class Tournament extends Document {
  @Prop({ required: true })
  title?: string;

  @Prop({ required: true })
  date?: Date;

  @Prop({ type: LocationSchema, required: true })
  location?: Location;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  players?: User[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
    default: [],
  })
  games?: [];

  @Prop({ type: [{ type: Round }], default: [] })
  rounds: Round[] = [];
}

export const TournamentSchema = SchemaFactory.createForClass(Tournament);
