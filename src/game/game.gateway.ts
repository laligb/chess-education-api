import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from '../game/game.service';

interface InvitePayload {
  from: string;
  to: string;
}

@WebSocketGateway({
  cors: { origin: ['http://localhost:3001', 'https://chessnext.vercel.app'] },
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  constructor(private readonly gameService: GameService) {}

  afterInit(server: Server) {
    this.server = server;
    console.log('✅ Chess WebSocket Server Initialized');
  }

  handleConnection(client: Socket) {
    console.log(`✅ Player connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Player disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendInvite')
  handleInvite(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: InvitePayload,
  ) {
    console.log(`📨 Invite from ${payload.from} to ${payload.to}`);

    if (this.server) {
      this.server.to(payload.to).emit('receiveInvite', { from: payload.from });
    } else {
      console.error('❌ WebSocket server is not initialized');
    }
  }

  @SubscribeMessage('acceptInvite')
  async handleAcceptInvite(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: InvitePayload,
  ) {
    console.log(`🎮 Game starting between ${payload.from} and ${payload.to}`);

    const game = await this.gameService.createGame(payload.from, payload.to);

    if (!game || !game.id || !this.server) {
      console.error('❌ Failed to create game');
      return;
    }

    client.join(game.id);
    this.server
      .to(payload.from)
      .emit('startGame', { gameId: String(game.id), opponent: payload.to });
    this.server
      .to(payload.to)
      .emit('startGame', { gameId: String(game.id), opponent: payload.from });

    console.log(
      `✅ Players ${payload.from} and ${payload.to} joined room ${game.id}`,
    );
  }

  @SubscribeMessage('sendMove')
  async handleMove(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { gameId: string; move: string },
  ) {
    console.log(`♟️ Move in game ${payload.gameId}: ${payload.move}`);

    const game = await this.gameService.addMove(payload.gameId, payload.move);

    if (!game || !this.server) {
      console.error('❌ Invalid game or WebSocket server');
      return;
    }

    console.log(`📜 Updated PGN: ${game.pgn}`);
    this.server
      .to(payload.gameId)
      .emit('receiveMove', { gameId: String(game.id), pgn: game.pgn });
  }
}
