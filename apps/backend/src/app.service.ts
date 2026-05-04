import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@cancha/shared';
import { prisma } from '@cancha/database';

@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    const userCount = await prisma.user.count();
    const dto = new CreateUserDto();
    dto.name = "Test";
    return `Hello World! Shared DTO: ${dto.name}, Users in DB: ${userCount}`;
  }
}
