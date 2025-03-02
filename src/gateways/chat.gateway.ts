import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface MessagePayload {
  message: string;
}

@WebSocketGateway({ cors: { origin: 'http://localhost:3001' } })
export class Chat
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server?: Server;

  afterInit(server: Server) {
    console.log('✅ WebSocket Server Initialized');
  }

  handleConnection(client: Socket) {
    console.log(`✅ Client connected: ${client.id}`);

    client.onAny((event: string, payload: unknown) => {
      console.log(`📡 Event received: ${event}`, payload);
    });
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: MessagePayload,
  ): void {
    console.log(`📨 Message received: ${payload.message}`);

    client.emit('messageAcknowledged', {
      status: 'Message received by server',
    });

    this.server?.emit('receiveMessage', payload);
  }
}
