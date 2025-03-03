import {
  Controller,
  Get,
  Post,
  Param,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
import { AuthService } from './auth.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly usersService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async loginUser(@Headers('Authorization') authHeader?: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Missing token');
    }

    try {
      const verifiedUser = await this.authService.verifyFirebaseToken(token);

      if (!verifiedUser || !verifiedUser.email) {
        throw new UnauthorizedException('Invalid Firebase token');
      }

      const userName: string = (verifiedUser.name as string) ?? 'No Name';

      const userEmail: string = verifiedUser.email ?? 'No Email';

      let user = await this.usersService.findByEmail(userEmail);
      if (!user) {
        user = await this.usersService.create({
          name: userName,
          email: userEmail,
          role: 'user',
          password: 'placeholder',
        });
      }

      return { message: 'Login successful', user };
    } catch (error) {
      console.error('🔥 Firebase Login Error:', error);
      throw new UnauthorizedException('Authentication failed');
    }
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
