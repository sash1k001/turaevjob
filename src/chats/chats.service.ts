import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma.service.js";


@Injectable()
export class ChatsService {
    constructor(
        private readonly prismaService: PrismaService
    ) {}

    async createOrGetChat(userId1: number, userId2: number, vacancyId?: number) {
        const existingChat = await this.prismaService.chat.findFirst({
            where: {
                AND: [
                    {
                        users: {
                            some: { id: userId1 },
                        },
                    },
                    {
                        users: {
                            some: { id: userId2 },
                        },
                    },
                ],
            },
            include: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                    },
                },
            },
        });

        if (existingChat) {
            return existingChat;
        }

        return this.prismaService.chat.create({
            data: {
                users: {
                    connect: [
                        {
                            id: userId1,
                        },
                        {
                            id: userId2,
                        },
                    ],
                },
                vacancyId: vacancyId,
            },
            include: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                    },
                },
            },
        });
    }

    async checkChatAccess(chatId: number, userId: number) {
        const chat = await this.prismaService.chat.findUnique({
            where: {
                id: chatId,
            },
            include: {
                users: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        if (!chat) {
            throw new NotFoundException(`чат не найден`);
        }

        const isParticipant = chat.users.some((user) => user.id === userId);

        if (!isParticipant) {
            throw new ForbiddenException(`у вас нет доступа к этому чату`);
        }

        return chat;
    }

    async saveMessage(chatId: number, senderId: number, content: string) {
        await this.checkChatAccess(chatId, senderId);

        return this.prismaService.message.create({
            data: {
                content,
                chatId,
                senderId,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }

    async getChatHistory(chatId: number, userId: number) {
        await this.checkChatAccess(chatId, userId);

        return this.prismaService.message.findMany({
            where: {
                chatId,
            },
            orderBy: {
                createdAt: 'asc',
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }
}