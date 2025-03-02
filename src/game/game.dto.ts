import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateGameDto {
  @IsString()
  pgn!: string;

  @IsMongoId()
  @IsNotEmpty()
  playerOne!: string;

  @IsMongoId()
  @IsNotEmpty()
  playerTwo!: string;

  @IsString()
  result!: string;
}
