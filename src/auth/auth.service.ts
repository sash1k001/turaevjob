import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma.service.js";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from "./dto/auth.dto.js";

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private jwtService: JwtService,
    ) {}

    async register(dto: RegisterDto) {
        const existingUser = await this.prismaService.user.findUnique({
            where: { email: dto.email },
        });

        if (existingUser) {
            throw new BadRequestException('пользователь с таким email уже существует');
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(dto.password, salt);

        const user = await this.prismaService.user.create({
            data: {
                email: dto.email,
                name: dto.name,
                passwordHash,
                role: dto.role,
            },
        });

        return this.generateToken(user.id, user.email, user.role);
    }

    async login(dto: LoginDto) {
        const user = await this.prismaService.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) {
            throw new UnauthorizedException('неверный email или пароль');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

        if (!isPasswordValid) {
            throw new UnauthorizedException('неверный email или пароль');
        }

        return this.generateToken(user.id, user.email, user.role);
    }

    private generateToken(userId: number, email: string, role: string) {
        const payload = { sub: userId, email, role };

        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}