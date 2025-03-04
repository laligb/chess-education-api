import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Tournament } from 'src/tournament/tournament.schema';
import { User } from 'src/user/user.schema';

@Schema()
export class Game extends Document {
  @Prop({ type: String, default: '' })
  pgn?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  playerOne?: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  playerTwo?: User;

  @Prop({ type: String, enum: ['onGoing', 'completed', 'notStarted'] })
  status?: string;

  @Prop({
    type: String,
    enum: ['1-0', '1/2-1/2', '0-1', '0-0', '+-', '-+', '--', '', '*'],
    default: '',
  })
  result?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    default: null,
  })
  tournamentId?: Tournament | null;
}

export const GameSchema = SchemaFactory.createForClass(Game);
