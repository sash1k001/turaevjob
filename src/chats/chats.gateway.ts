import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatsService } from "./chats.service.js";
import { JwtService } from "@nestjs/jwt";


@WebSocketGateway({ cors: { origin: '*' }})
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly chatsService: ChatsService,
        private readonly jwtService: JwtService,
    ) {}

    handleConnection(client: Socket) {
        console.log(`клиент подключился ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`клиент отключился ${client.id}`);
    }

    @SubscribeMessage('joinChat')
    handleJoinChat(
        @MessageBody() data: { chatId: number },
        @ConnectedSocket() client: Socket,
    ) {
        const roomName = `chat_${data.chatId}`;

        client.join(roomName);
        console.log(`клиент ${client.id} зашел в комнату ${roomName}`);
        return {
            event: 'joined',
            data: `Вы вошли в чат ${data.chatId}`,
        }
    }

    // дописать gateway и так далее ^_^

}