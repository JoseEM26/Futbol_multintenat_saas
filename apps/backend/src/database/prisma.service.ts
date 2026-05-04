import { Injectable, OnModuleInit } from '@nestjs/common';
import { prisma } from '@cancha/database';

@Injectable()
export class PrismaService implements OnModuleInit {
  async onModuleInit() {
    // DB connection is handled automatically by prisma client imported from @cancha/database
    // but we can add hooks or custom logic here
  }
}
