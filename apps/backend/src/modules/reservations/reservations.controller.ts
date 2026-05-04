import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { FilterReservationsDto } from '@cancha/shared';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';

@UseGuards(AuthGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  create(@Body() createReservationDto: any, @CurrentUser() user: any) {
    return this.reservationsService.create(createReservationDto, user);
  }

  @Get()
  findAll(@Query() query: FilterReservationsDto, @CurrentUser() user: any) {
    return this.reservationsService.findAll(query, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.reservationsService.findOne(id, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReservationDto: any, @CurrentUser() user: any) {
    return this.reservationsService.update(id, updateReservationDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.reservationsService.remove(id, user);
  }
}

