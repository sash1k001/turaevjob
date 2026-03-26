import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ChatsService } from "./chats.service.js";
import { PrismaService } from "../prisma.service.js";
import { ChatsGateway } from "./chats.gateway.js";
import { ChatsController } from "./chats.controller.js";
import "dotenv/config"

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_KEY as string,
        }),
    ],
    providers: [ChatsService, PrismaService, ChatsGateway],
    controllers: [ChatsController],
})
export class ChatsModule {}