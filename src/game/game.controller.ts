import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './game.dto';
import { Game } from './game.schema';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  async create(@Body() gameDto: CreateGameDto): Promise<Game> {
    return this.gameService.create(gameDto);
  }

  @Get()
  async findAll(): Promise<Game[]> {
    return this.gameService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Game | null> {
    return this.gameService.findOne(id);
  }
}
