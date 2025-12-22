import {
  WebSocketGateway as WSGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WSGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class WebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  emitIncomingCall(data: any) {
    this.server.emit('incoming_call', data);
  }

  emitCallStatus(data: any) {
    this.server.emit('call_status', data);
  }

  emitNewMessage(data: any) {
    this.server.emit('new_message', data);
  }

  emitOperatorStatus(data: any) {
    this.server.emit('operator_status', data);
  }
}

