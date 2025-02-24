import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Game } from './game.schema';
import { Model } from 'mongoose';
import { CreateGameDto } from './game.dto';

@Injectable()
export class GameService {
  constructor(@InjectModel(Game.name) private gameModel: Model<Game>) {}

  async create(gameDto: CreateGameDto): Promise<Game> {
    if (!this.isValidPGN(gameDto.pgn)) {
      throw new BadRequestException('Invalid PGN format');
    }

    const game = new this.gameModel(gameDto);
    return game.save();
  }

  async findAll(): Promise<Game[]> {
    return this.gameModel.find().exec();
  }

  async findOne(id: string): Promise<Game | null> {
    return this.gameModel.findById(id).exec();
  }

  private isValidPGN(pgn: string): boolean {
    return pgn.match(/\d+\.\s?[a-h1-8NBRQKx+-]+/g) !== null;
  }
}
