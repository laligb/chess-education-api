import { Module } from '@nestjs/common';
import { TournamentController } from './tournament.controller';
import { TournamentService } from './tournament.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Tournament, TournamentSchema } from './tournament.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tournament.name, schema: TournamentSchema },
    ]),
    UserModule,
  ],
  controllers: [TournamentController],
  providers: [TournamentService],
})
export class TournamentModule {}
