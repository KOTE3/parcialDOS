import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Booking } from './booking.entity';
// RoomModule proporciona los datos de precio y las reservas previas de cada habitación.
import { RoomModule } from '../room/room.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), RoomModule],
  providers: [BookingService],
  controllers: [BookingController],
  exports: [BookingService],
})
export class BookingModule {}
