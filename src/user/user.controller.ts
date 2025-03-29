import {
  Controller,
  Get,
  Post,
  Param,
  Headers,
  UnauthorizedException,
  Body,
  Delete,
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
      console.error('❌ Missing Authorization header');
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
        console.log('🆕 Creating new user in MongoDB:', {
          userName,
          userEmail,
        });
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

  @Post('signup')
  async signupUser(
    @Body() body: { name: string },
    @Headers('Authorization') authHeader?: string,
  ) {
    console.log('🔍 Signup request received, checking Firebase token...');

    if (!authHeader) {
      console.error('❌ Missing Authorization header');
      throw new UnauthorizedException('Missing Authorization header');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      console.error('❌ Missing token');
      throw new UnauthorizedException('Missing token');
    }

    try {
      const verifiedUser = await this.authService.verifyFirebaseToken(token);
      console.log('✅ Verified Firebase User:', verifiedUser);

      if (!verifiedUser || !verifiedUser.email) {
        console.error('❌ Invalid Firebase token');
        throw new UnauthorizedException('Invalid Firebase token');
      }

      const userEmail: string = verifiedUser.email;
      const userName: string = body.name || 'No Name';

      let user = await this.usersService.findByEmail(userEmail);

      if (user) {
        return { message: 'User already exists', user };
      }

      user = await this.usersService.create({
        name: userName,
        email: userEmail,
        role: 'user',
        password: 'placeholder',
      });

      console.log('✅ Signup successful:', user);
      return { message: 'Signup successful', user };
    } catch (error) {
      console.error('🔥 Firebase Signup Error:', error);
      throw new UnauthorizedException('Signup failed');
    }
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('me')
  async getCurrentUser(@Headers('Authorization') authHeader?: string) {
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

      const user = await this.usersService.findByEmail(verifiedUser.email);

      if (!user) {
        throw new UnauthorizedException('User not found in database');
      }
      console.log('👤 Found user in DB:', user);

      return user;
    } catch (error) {
      console.error('🔥 Error fetching current user:', error);
      throw new UnauthorizedException('Failed to fetch user');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  async deleteUser(@Param('id') userId: string) {
    return await this.usersService.deleteUser(userId);
  }
}
