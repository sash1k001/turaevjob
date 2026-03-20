import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma.service.js";
import { CreateResumeDto } from "./dto/create-resume.dto.js";

@Injectable()
export class ResumesService {
    constructor(
        private prismaService: PrismaService,
    ) {}

    async create(userId: number, dto: CreateResumeDto) {
        const existingResume = await this.prismaService.resume.findUnique({
            where: { userId },
        });

        if (existingResume) {
            throw new BadRequestException('у вас уже есть резюме');
        }

        return this.prismaService.resume.create({
            data: {
                ...dto,
                userId,
            },
        });
    }

    async findAll() {
        return this.prismaService.resume.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: { id: 'desc' },
        });
    }

    async findOne(id: number) {
        const resume = await this.prismaService.resume.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!resume) {
            throw new NotFoundException(`резюме с ID ${id} не найдено`);
        }

        return resume;
    }
}