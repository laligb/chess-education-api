import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
import { CreateUserDto } from './user.dto';
import { AuthService } from './auth.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly usersService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async loginUser(
    @Body() userDto: CreateUserDto,
    @Headers('Authorization') authHeader: string,
  ) {
    const token = authHeader?.split(' ')[1]; // ✅ Extract Firebase token
    const verifiedUser = await this.authService.verifyFirebaseToken(token);

    if (!verifiedUser) {
      throw new UnauthorizedException('Invalid Firebase token');
    }

    // ✅ Check if the user already exists in MongoDB
    let user = await this.usersService.findByEmail(userDto.email);

    if (!user) {
      user = await this.usersService.create(userDto); // ✅ If new user, save in MongoDB
    }

    return user;
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findOne(id);
  }
}
