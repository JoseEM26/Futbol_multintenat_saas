import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CanchasModule } from './modules/canchas/canchas.module';
import { ReservationsModule } from './modules/reservations/reservations.module';

@Module({
  imports: [CanchasModule, ReservationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
