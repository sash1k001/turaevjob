import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateVacancyDto {
    @IsString()
    @IsNotEmpty({ message: 'название вакансии не может быть пустым' })
    title: string;

    @IsString()
    @IsNotEmpty({ message: 'описание вакансии не может быть пустым' })
    description: string;

    @IsNumber({}, { message: 'зарплата "от" должна быть числом' })
    @IsOptional()
    salaryFrom?: number;

    @IsNumber({}, { message: 'зарплата "до" должна быть числом' })
    @IsOptional()
    salaryTo?: number;
}