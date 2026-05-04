import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { prisma } from '@cancha/database';
import { CreateCanchaDto, FilterCanchasDto, UpdateCanchaDto } from '@cancha/shared';
import { ERROR_MESSAGES } from '../../common/constants/messages.constant';

@Injectable()
export class CanchasService {
  async create(createCanchaDto: CreateCanchaDto, user: any) {
    if (user.role === 'CUSTOMER') {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN_CUSTOMER_CREATE);
    }
    const tenantId = user.role === 'TENANT_ADMIN' ? user.tenantId : createCanchaDto.tenantId;
    
    if (!tenantId) {
      throw new ForbiddenException(ERROR_MESSAGES.TENANT_REQUIRED);
    }

    return prisma.cancha.create({
      data: {
        ...createCanchaDto,
        tenantId,
      },
    });
  }

  async findAll(query: FilterCanchasDto, user: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    let filterTenant = query.tenantId;
    if (user && user.role === 'TENANT_ADMIN') {
      filterTenant = user.tenantId;
    }

    const where: any = {};
    if (filterTenant) where.tenantId = filterTenant;
    if (query.search) {
      where.name = { contains: query.search, mode: 'insensitive' };
    }
    if (query.minPrice || query.maxPrice) {
      where.pricePerHour = {};
      if (query.minPrice) where.pricePerHour.gte = Number(query.minPrice);
      if (query.maxPrice) where.pricePerHour.lte = Number(query.maxPrice);
    }

    const orderBy: any = query.sortBy 
      ? { [query.sortBy]: query.sortOrder || 'asc' } 
      : { createdAt: 'desc' };

    const [data, total] = await Promise.all([
      prisma.cancha.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: { tenant: { select: { name: true, logo: true } } }
      }),
      prisma.cancha.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, user: any) {
    const cancha = await prisma.cancha.findUnique({ 
      where: { id },
      include: { tenant: true }
    });

    if (!cancha) {
      throw new NotFoundException(ERROR_MESSAGES.CANCHA_NOT_FOUND);
    }

    if (user && user.role === 'TENANT_ADMIN' && cancha.tenantId !== user.tenantId) {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN_TENANT_ACCESS);
    }

    return cancha;
  }

  async update(id: string, updateCanchaDto: UpdateCanchaDto, user: any) {
    await this.findOne(id, user);

    return prisma.cancha.update({
      where: { id },
      data: updateCanchaDto,
    });
  }

  async remove(id: string, user: any) {
    await this.findOne(id, user);
    return prisma.cancha.delete({ where: { id } });
  }
}

