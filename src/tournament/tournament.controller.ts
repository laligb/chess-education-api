import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { CreateTournamentDto } from './tournament.dto';
import { Tournament } from './tournament.schema';

@Controller('tournaments')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Post()
  async create(
    @Body() tournamentDto: CreateTournamentDto,
  ): Promise<Tournament> {
    return this.tournamentService.create(tournamentDto);
  }

  @Post(':id/rounds')
  async addRound(
    @Param('id') tournamentId: string,
    @Body() body: { roundNumber: number; gameIds: string[] },
  ) {
    return this.tournamentService.addRound(
      tournamentId,
      body.roundNumber,
      body.gameIds,
    );
  }

  @Get()
  async findAll(): Promise<Tournament[]> {
    return this, this.tournamentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Tournament | null> {
    return this.tournamentService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateTournamentDto>,
  ): Promise<Tournament> {
    return this.tournamentService.update(id, updateData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    return this.tournamentService.delete(id);
  }

  @Post(':id/join')
  async joinTournament(
    @Param('id') tournamentId: string,
    @Body('userId') userId: string,
  ): Promise<Tournament> {
    return this.tournamentService.joinTournament(tournamentId, userId);
  }

  @Delete(':id/withdraw')
  async withdrawTournament(
    @Param('id') tournamentId: string,
    @Body('userId') userId: string,
  ): Promise<Tournament> {
    return this.tournamentService.withdrawTournament(tournamentId, userId);
  }
}
