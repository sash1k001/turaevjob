import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Role } from "../enums/role.enum.js";

export class RegisterDto {
    @IsEmail({}, { message: 'неверный формат email' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Имя не может быть пустым' })
    name: string;

    @IsString()
    @MinLength(6, { message: 'пароль должен содержать минимум 6 символов' })
    password: string;

    @IsEnum(Role, { message: `роль должна быть либо "EMPLOYER", либо "SEEKER"` })
    role: Role;
}

export class LoginDto {
    @IsEmail({}, { message: 'неверный формат email' })
    email: string;

    @IsString()
    @MinLength(6, { message: 'пароль должен содержать минимум 6 символов' })
    password: string;
}