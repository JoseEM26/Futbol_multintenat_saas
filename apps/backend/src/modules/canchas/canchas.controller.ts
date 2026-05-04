import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CanchasService } from './canchas.service';
import { CreateCanchaDto, FilterCanchasDto, UpdateCanchaDto } from '@cancha/shared';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';

@UseGuards(AuthGuard)
@Controller('canchas')
export class CanchasController {
  constructor(private readonly canchasService: CanchasService) {}

  @Post()
  create(@Body() createCanchaDto: CreateCanchaDto, @CurrentUser() user: any) {
    return this.canchasService.create(createCanchaDto, user);
  }

  @Get()
  findAll(@Query() query: FilterCanchasDto, @CurrentUser() user: any) {
    return this.canchasService.findAll(query, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.canchasService.findOne(id, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCanchaDto: UpdateCanchaDto, @CurrentUser() user: any) {
    return this.canchasService.update(id, updateCanchaDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.canchasService.remove(id, user);
  }
}

