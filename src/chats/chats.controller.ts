import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { ChatsService } from "./chats.service.js";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";

@UseGuards(JwtAuthGuard)
@Controller('chats')
export class ChatsController {
    constructor(
        private readonly chatsService: ChatsService,
    ) {}

    @Post('start/:targetUserId')
    startChat(
        @CurrentUser() user: any,
        @Param('targetUserId', ParseIntPipe) targetUserId: number,
        @Body('vacancyId') vacancyId?: number,
    ) {
        return this.chatsService.createOrGetChat(user.id, targetUserId, vacancyId);
    }

    @Get(':chatId/messages')
    getMessages(
        @Param('chatId', ParseIntPipe) chatId: number,
        @CurrentUser() user: any,
    ) {
        return this.chatsService.getChatHistory(chatId, user.id);
    }
}