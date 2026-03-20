import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}
  
  getHello(): string {
    return 'Hello World!';
  }


  any() {
    return this.prisma.user.findMany();
  }
}
