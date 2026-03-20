import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateResumeDto {
    @IsString()
    @IsNotEmpty({ message: 'желаемая должность не может быть пустой' })
    title: string;

    @IsString()
    @IsNotEmpty({ message: 'о себе/опыт работы не может быть пустым' })
    description: string;

    @IsString()
    @IsNotEmpty({ message: 'укажите навыки (через запятую)' })
    skills: string;

    @IsNumber({}, { message: 'ожидаемая зарплата должна быть числом' })
    @IsOptional()
    salary?: number;
}