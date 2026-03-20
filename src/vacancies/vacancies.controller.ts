import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { VacanciesService } from "./vacancies.service.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../auth/enums/role.enum.js";
import { CreateVacancyDto } from "./dto/create-vacancy.dto.js";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vacancies')
export class VacanciesController {
    constructor(
        private readonly vacanciesService: VacanciesService,
    ) {}

    @Roles(Role.EMPLOYER)
    @Post()
    create(
        @Body() dto: CreateVacancyDto,
        @CurrentUser() user: any,
    ) {
        return this.vacanciesService.create(user.id, dto);
    }

    @Roles(Role.SEEKER, Role.EMPLOYER)
    @Get()
    findAll() {
        return this.vacanciesService.findAll();
    }

    @Roles(Role.SEEKER)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.vacanciesService.findOne(id);
    }
}