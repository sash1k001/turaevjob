import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { LoginDto, RegisterDto } from "./dto/auth.dto.js";
import { JwtAuthGuard } from "./guards/jwt-auth.guard.js";
import { CurrentUser } from "./decorators/current-user.decorator.js";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@CurrentUser() user: any) {
        return {
            user: user,
        };
    }
}