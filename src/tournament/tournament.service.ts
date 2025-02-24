import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tournament } from './tournament.schema';
import { Model } from 'mongoose';
import { CreateTournamentDto } from './tournament.dto';

@Injectable()
export class TournamentService {
  constructor(
    @InjectModel(Tournament.name) private tournamentModel: Model<Tournament>,
  ) {}

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
}
