import { IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsMongoId()
  professor?: string;

  @IsMongoId()
  @IsArray()
  student?: string;
}
