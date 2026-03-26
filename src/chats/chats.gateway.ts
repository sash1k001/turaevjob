import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatsService } from "./chats.service.js";
import { JwtService } from "@nestjs/jwt";
import "dotenv/config"


@WebSocketGateway({ cors: { origin: '*' } })
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly chatsService: ChatsService,
        private readonly jwtService: JwtService,
    ) { }

    handleConnection(client: Socket) {
        try {
            const authHeader = client.handshake.headers.authorization;
            const token = authHeader?.split(' ')[1];

            if (!token) {
                throw new Error('токен отсутствует');
            }

            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_KEY as string,
            });

            client.data.userId = payload.sub;
            console.log(`✅ Подключение разрешено: клиент ${client.id}, userId: ${payload.sub}`);
        } catch (error) {
            console.log(`❌ Подключение отклонено: клиент ${client.id} (неавторизован)`);
            client.disconnect(true);
        }
    }

    handleDisconnect(client: Socket) {
        console.log(`🔌 Клиент отключился: ${client.id}`);
    }

    @SubscribeMessage('joinChat')
    async handleJoinChat(
        @MessageBody() data: { chatId: number },
        @ConnectedSocket() client: Socket,
    ) {
        const userId = client.data.userId;
        await this.chatsService.checkChatAccess(data.chatId, userId);

        const roomName = `chat_${data.chatId}`;
        client.join(roomName);
        console.log(`клиент ${client.id} зашел в комнату ${roomName}`);
        return {
            event: 'joined',
            data: `Вы вошли в чат ${data.chatId}`,
        }
    }

    @SubscribeMessage('sendMessage')
    async handleMessage(
        @MessageBody() data: { chatId: number, content: string },
        @ConnectedSocket() client: Socket,
    ) {
        const senderId = client.data.userId;

        const savedMessage = await this.chatsService.saveMessage(
            data.chatId,
            senderId,
            data.content,
        );

        const roomName = `chat_${data.chatId}`;
        this.server.to(roomName).emit('newMessage', savedMessage);

        return savedMessage;
    }

}