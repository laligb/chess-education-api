import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tournament } from './tournament.schema';
import { Model } from 'mongoose';
import { CreateTournamentDto } from './tournament.dto';
import { Game } from 'src/game/game.schema';

@Injectable()
export class TournamentService {
  constructor(
    @InjectModel(Tournament.name) private tournamentModel: Model<Tournament>,
  ) {}

  async addRound(
    tournamentId: string,
    roundNumber: number,
    gameIds: string[],
  ): Promise<Tournament> {
    const tournament = await this.tournamentModel.findById(tournamentId);
    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }

    const newRound = {
      roundNumber,
      games: gameIds.map((id) => ({ _id: id }) as Game),
    };

    tournament.rounds.push(newRound);

    return tournament.save();
  }

  async create(tournamentDto: CreateTournamentDto): Promise<Tournament> {
    const tournament = new this.tournamentModel(tournamentDto);
    return tournament.save();
  }

  async findAll(): Promise<Tournament[]> {
    return this.tournamentModel.find().exec();
  }

  async findOne(id: string): Promise<Tournament | null> {
    return this.tournamentModel.findById(id).exec();
  }

  async update(
    id: string,
    updateData: Partial<CreateTournamentDto>,
  ): Promise<Tournament> {
    const tournament = await this.tournamentModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }

    return tournament;
  }

  async delete(id: string): Promise<{ message: string }> {
    const tournament = await this.tournamentModel.findByIdAndDelete(id);
    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }
    return { message: 'Tournament deleted successfully' };
  }
}
