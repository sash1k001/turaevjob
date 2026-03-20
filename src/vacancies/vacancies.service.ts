import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma.service.js";
import { CreateVacancyDto } from "./dto/create-vacancy.dto.js";

@Injectable()
export class VacanciesService {
    constructor(
        private readonly prismaService: PrismaService,
    ) {}

    async create(userId: number, dto: CreateVacancyDto) {
        return this.prismaService.vacancy.create({
            data: {
                ...dto,
                userId: userId,
            },
        });
    }

    async findAll() {
        return this.prismaService.vacancy.findMany({
            where: { isActive: true },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            },
            orderBy: { id: 'desc' },
        });
    }

    async findOne(id: number) {
        const vacancy = await this.prismaService.vacancy.findUnique({
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

        if (!vacancy) {
            throw new NotFoundException(`вакансия с ID ${id} не найдена`);
        }

        return vacancy;
    }
}