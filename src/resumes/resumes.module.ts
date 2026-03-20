import { Module } from "@nestjs/common";
import { ResumesService } from "./resumes.service.js";
import { PrismaService } from "../prisma.service.js";
import { ResumesController } from "./resumes.controller.js";

@Module({
    providers: [ResumesService, PrismaService],
    controllers: [ResumesController]
})
export class ResumesModule {}