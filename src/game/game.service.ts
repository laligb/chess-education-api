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

  async createGame(playerOneId: string, playerTwoId: string): Promise<Game> {
    console.log(`📌 Creating game for ${playerOneId} vs ${playerTwoId}`);

    const game = new this.gameModel({
      playerOne: playerOneId,
      playerTwo: playerTwoId,
      pgn: '',
      status: 'in-progress',
    });

    try {
      const savedGame = await game.save();
      console.log(`✅ Game saved with ID: ${savedGame.id}`);
      return savedGame.toObject() as Game;
    } catch (error) {
      console.error('❌ Game save failed:', error);
      throw new Error('Game creation failed');
    }
  }

  async addMove(gameId: string, move: string): Promise<Game | null> {
    const game = await this.gameModel.findById(gameId);
    if (!game) {
      throw new BadRequestException('Game not found');
    }

    game.pgn += ` ${move}`;
    await game.save();
    return game;
  }

  private isValidPGN(pgn: string): boolean {
    return pgn.match(/\d+\.\s?[a-h1-8NBRQKx+-]+/g) !== null;
  }
}
