import {
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { LocationDto } from './location.dto';
import { Type } from 'class-transformer';

export class CreateTournamentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDate()
  @IsNotEmpty()
  date: Date;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsMongoId()
  player: string;

  @IsMongoId()
  game: string;
}
