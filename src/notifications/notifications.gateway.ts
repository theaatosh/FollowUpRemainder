import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { EmailService } from "src/Email/email.service";
import { getReminderEmailTemplate } from "./templates/reminder-email.template";
import { ConfigService } from "@nestjs/config";

@WebSocketGateway({ cors: true })
export class NotificationsGateway {
  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) { }

  @WebSocketServer()
  server: Server;

  // Map of userId -> socketId for targeting
  private userSockets = new Map<string, string>();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.userSockets.set(userId, client.id);
      console.log(`✅ User connected: ${userId} -> ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.userSockets.delete(userId);
      console.log(`❌ User disconnected: ${userId}`);
    }
  }

  async sendNotificationToUser(userId: string, notification: any) {
    console.log("🔔 Sending notification to user:", userId);
    const socketId = this.userSockets.get(userId);
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    // Generate beautiful HTML email with client profile link
    const emailHtml = getReminderEmailTemplate({
      title: notification.title,
      message: notification.message,
      clientName: notification.data?.clientName,
      followUpId: notification.data?.followUpId,
      clientId: notification.data?.clientId,
      frontendUrl: frontendUrl,
    });

    // Send email in both cases (user online or offline)
    await this.emailService.sendEmail({
      to: notification.userEmail,
      subject: `🔔 ${notification.title}`,
      html: emailHtml,
    });

    if (socketId) {
      console.log("📡 User online - also sending via socket:", socketId);
      this.server.to(socketId).emit('notification', notification);
    } else {
      console.log("📧 User offline - email sent to:", notification.userEmail);
    }
  }
}