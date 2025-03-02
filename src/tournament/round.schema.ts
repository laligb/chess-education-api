import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Game } from 'src/game/game.schema';

export class Round {
  @Prop({ required: true })
  roundNumber?: number;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
    default: [],
  })
  games?: Game[];
}

export const RoundSchema = SchemaFactory.createForClass(Round);
