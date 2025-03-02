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
import { GameService } from '../game/game.service'; // ✅ Use GameService instead of injecting GameModel

interface InvitePayload {
  from: string;
  to: string;
}

interface MovePayload {
  gameId: string;
  move: string;
}

@WebSocketGateway({ cors: { origin: 'http://localhost:3001' } })
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly gameService: GameService) {}

  afterInit(server: Server) {
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
    this.server.to(payload.to).emit('receiveInvite', { from: payload.from });
  }

  @SubscribeMessage('acceptInvite')
  async handleAcceptInvite(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: InvitePayload,
  ) {
    console.log(`🎮 Game starting between ${payload.from} and ${payload.to}`);

    const game = await this.gameService.createGame(payload.from, payload.to); // ✅ Use GameService

    client.join(game.id);
    this.server
      .to(payload.from)
      .emit('startGame', { gameId: game.id, opponent: payload.to });
    this.server
      .to(payload.to)
      .emit('startGame', { gameId: game.id, opponent: payload.from });

    console.log(
      `✅ Players ${payload.from} and ${payload.to} joined room ${game.id}`,
    );
  }

  @SubscribeMessage('sendMove')
  async handleMove(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: MovePayload,
  ) {
    console.log(`♟️ Move in game ${payload.gameId}: ${payload.move}`);

    const game = await this.gameService.addMove(payload.gameId, payload.move); // ✅ Use GameService

    if (!game) {
      console.error('❌ Game not found!');
      return;
    }

    console.log(`📜 Updated PGN: ${game.pgn}`);
    this.server
      .to(payload.gameId)
      .emit('receiveMove', { gameId: game.id, pgn: game.pgn });
  }
}
