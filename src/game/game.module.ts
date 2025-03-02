import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { Game, GameSchema } from './game.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { GameGateway } from './game.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
  ],
  providers: [GameService, GameGateway],
  controllers: [GameController],
  exports: [GameService],
})
export class GameModule {}
