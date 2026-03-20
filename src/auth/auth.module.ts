import "dotenv/config";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { PrismaService } from "../prisma.service.js";
import { AuthService } from "./auth.service.js";
import { AuthController } from "./auth.controller.js";

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_KEY as string,
            signOptions: { expiresIn: '1d' },
        }),
    ],
    providers: [AuthService, PrismaService],
    controllers: [AuthController],
})
export class AuthModule {}