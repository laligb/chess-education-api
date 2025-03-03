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
    console.log('🔍 Login request received, checking Firebase token...');

    if (!authHeader) {
      console.error('❌ Missing Authorization header');
      throw new UnauthorizedException('Missing Authorization header');
    }

    const token = authHeader.split(' ')[1];
    console.log('🔑 Received token:', token);

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

      const userName: string = (verifiedUser.name as string) ?? 'No Name';
      const userEmail: string = verifiedUser.email ?? 'No Email';

      console.log('🔍 Checking if user exists in MongoDB:', userEmail);
      let user = await this.usersService.findByEmail(userEmail);
      console.log('👤 User found in MongoDB:', user);

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

      console.log('✅ Login successful:', user);
      return { message: 'Login successful', user };
    } catch (error) {
      console.error('🔥 Firebase Login Error:', error);
      throw new UnauthorizedException('Authentication failed');
    }
  }

  @Post('signup')
  async signupUser(@Headers('Authorization') authHeader?: string) {
    console.log('🔍 Signup request received, checking Firebase token...');

    if (!authHeader) {
      console.error('❌ Missing Authorization header');
      throw new UnauthorizedException('Missing Authorization header');
    }

    const token = authHeader.split(' ')[1];
    console.log('🔑 Received token:', token);

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

      const userName: string = (verifiedUser.name as string) ?? 'No Name';
      const userEmail: string = verifiedUser.email ?? 'No Email';

      console.log('🔍 Checking if user already exists in MongoDB:', userEmail);
      let user = await this.usersService.findByEmail(userEmail);

      if (user) {
        console.log('⚠️ User already exists, returning existing user:', user);
        return { message: 'User already exists', user };
      }

      console.log('🆕 Creating new user in MongoDB:', { userName, userEmail });
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

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findOne(id);
  }
}
