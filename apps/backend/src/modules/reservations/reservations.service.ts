import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { prisma } from '@cancha/database';
import { FilterReservationsDto } from '@cancha/shared';
import { ERROR_MESSAGES } from '../../common/constants/messages.constant';

@Injectable()
export class ReservationsService {
  async create(createReservationDto: any, user: any) {
    const cancha = await prisma.cancha.findUnique({ where: { id: createReservationDto.canchaId } });
    if (!cancha) throw new NotFoundException(ERROR_MESSAGES.CANCHA_NOT_FOUND);

    if (user.role === 'TENANT_ADMIN' && cancha.tenantId !== user.tenantId) {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN_TENANT_ACCESS);
    }

    if (user.role === 'CUSTOMER') {
      createReservationDto.userId = user.id;
    }

    return prisma.reservation.create({
      data: createReservationDto,
    });
  }

  async findAll(query: FilterReservationsDto, user: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (user.role === 'CUSTOMER') {
      where.userId = user.id; 
    } else if (user.role === 'TENANT_ADMIN') {
      where.cancha = { tenantId: user.tenantId };
    }

    if (query.canchaId) where.canchaId = query.canchaId;
    if (query.status) where.status = query.status;
    if (query.dateFrom || query.dateTo) {
      where.startTime = {};
      if (query.dateFrom) where.startTime.gte = new Date(query.dateFrom);
      if (query.dateTo) where.startTime.lte = new Date(query.dateTo);
    }

    const orderBy: any = query.sortBy 
      ? { [query.sortBy]: query.sortOrder || 'desc' } 
      : { startTime: 'desc' };

    const [data, total] = await Promise.all([
      prisma.reservation.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: { user: { select: { name: true, email: true } }, cancha: true }
      }),
      prisma.reservation.count({ where }),
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
    const reservation = await prisma.reservation.findUnique({ 
      where: { id },
      include: { user: true, cancha: true }
    });

    if (!reservation) throw new NotFoundException(ERROR_MESSAGES.RESERVATION_NOT_FOUND);

    if (user.role === 'CUSTOMER' && reservation.userId !== user.id) {
      throw new ForbiddenException(ERROR_MESSAGES.UNAUTHORIZED);
    }
    if (user.role === 'TENANT_ADMIN' && reservation.cancha.tenantId !== user.tenantId) {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN_TENANT_ACCESS);
    }

    return reservation;
  }

  async update(id: string, updateReservationDto: any, user: any) {
    await this.findOne(id, user); 
    return prisma.reservation.update({
      where: { id },
      data: updateReservationDto,
    });
  }

  async remove(id: string, user: any) {
    await this.findOne(id, user); 
    return prisma.reservation.delete({ where: { id } });
  }
}

