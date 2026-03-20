import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { VacanciesModule } from './vacancies/vacancies.module.js';
import { ResumesModule } from './resumes/resumes.module.js';

@Module({
  imports: [AuthModule, VacanciesModule, ResumesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}