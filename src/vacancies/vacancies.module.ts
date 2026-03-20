import { Module } from "@nestjs/common";
import { VacanciesService } from "./vacancies.service.js";
import { PrismaService } from "../prisma.service.js";
import { VacanciesController } from "./vacancies.controller.js";

@Module({
    providers: [VacanciesService, PrismaService],
    controllers: [VacanciesController]
})
export class VacanciesModule {}