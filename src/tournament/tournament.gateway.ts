import {
  // MessageBody,
  // SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TournamentService } from './tournament.service';

@WebSocketGateway({ cors: true })
export class TournamentGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly tournamentService: TournamentService) {}

  async emitTournamentUpdate(tournamentId: string) {
    const tournament = await this.tournamentService.findOne(tournamentId);
    this.server.emit(`tournament-update-${tournamentId}`, tournament);
  }

  // @SubscribeMessage('start-tournament')
  // async handleStartTournament(@MessageBody() data: {tournamentId: string}) {
  //   await this.tournamentService.
  // };
}
