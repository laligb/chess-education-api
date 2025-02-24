import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { CreateTournamentDto } from './tournament.dto';
import { Tournament } from './tournament.schema';

@Controller('tournaments')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Post()
  async creatte(
    @Body() tournamentDto: CreateTournamentDto,
  ): Promise<Tournament> {
    return this.tournamentService.create(tournamentDto);
  }

  @Get()
  async findAll(): Promise<Tournament[]> {
    return this, this.tournamentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Tournament | null> {
    return this.tournamentService.findOne(id);
  }
}
