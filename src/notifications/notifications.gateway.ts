import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({ cors: true })
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;
  // Map of userId -> socketId for targeting
  private userSockets = new Map<string, string>();
  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.userSockets.set(userId, client.id);
    }
  }
  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.userSockets.delete(userId);
    }
  }
  sendNotificationToUser(userId: string, notification: any) {
    console.log("userId",userId)
    console.log("notification",notification)
    console.log("eta aairaxa aba user ko ma pathauxa esle")
    const socketId = this.userSockets.get(userId);
    console.log("socketId",socketId)
    if (socketId) {
      console.log("socketId milxa aba pathauxa")
      this.server.to(socketId).emit('notification', notification);
    }
  }
}