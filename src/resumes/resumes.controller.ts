import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { ResumesService } from "./resumes.service.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../auth/enums/role.enum.js";
import { CreateResumeDto } from "./dto/create-resume.dto.js";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('resumes')
export class ResumesController {
    constructor(
        private readonly resumesService: ResumesService,
    ) {}

    @Roles(Role.SEEKER)
    @Post()
    create(
        @Body() dto: CreateResumeDto,
        @CurrentUser() user: any,
    ) {
        return this.resumesService.create(user.id, dto);
    }

    @Roles(Role.EMPLOYER, Role.SEEKER)
    @Get()
    findAll() {
        return this.resumesService.findAll();
    }

    @Roles(Role.EMPLOYER, Role.SEEKER)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.resumesService.findOne(id);
    }
}