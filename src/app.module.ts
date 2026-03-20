import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { VacanciesModule } from './vacancies/vacancies.module.js';

@Module({
  imports: [AuthModule, VacanciesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}