import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupsModule } from './groups/groups.module';
import { GameModule } from './game/game.module';
import { TournamentModule } from './tournament/tournament.module';

const mongoUri =
  process.env.MONGO_URI || 'mongodb://localhost:27017/nestjs-test';

@Module({
  imports: [
    MongooseModule.forRoot(mongoUri),
    UserModule,
    GroupsModule,
    GameModule,
    TournamentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
