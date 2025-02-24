import { IsNumber, IsString } from 'class-validator';

export class LocationDto {
  @IsString()
  name: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}
