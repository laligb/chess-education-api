import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(userDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(userDto);
    return user.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await this.userModel.findByIdAndDelete(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }

  async addTournamentToPlayer(
    userId: string,
    tournamentId: string,
  ): Promise<User> {
    const player = await this.userModel.findById(userId);
    if (!player) {
      throw new Error('Player not found');
    }

    player.tournaments.push(tournamentId);
    return player.save();
  }

  async withdrawFromTournament(
    userId: string,
    tournamentId: string,
  ): Promise<User> {
    const player = await this.userModel.findById(userId);
    if (!player) {
      throw new Error('Player not found');
    }

    const tournamentIndex = player.tournaments.indexOf(tournamentId);
    if (tournamentIndex === -1) {
      throw new Error('Player not registered in this tournament');
    }

    player.tournaments.splice(tournamentIndex, 1);
    return player.save();
  }
}
