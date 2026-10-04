import { Controller, Post, Get, Body, Param, Delete, Request, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './booking.entity';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  // Solo usuarios autenticados pueden reservar; el guard coloca el usuario validado en req.user.
  @UseGuards(AuthGuard('jwt'))
  async createBooking(
    @Request() req: { user: { id: number } },
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<Booking> {
    // El id proviene del token verificado, nunca de un valor predeterminado o del cuerpo.
    return this.bookingService.create(req.user.id, createBookingDto);
  }

  @Get(':id')
  async getBooking(@Param('id', ParseIntPipe) id: number): Promise<Booking> {
    return this.bookingService.findOne(id);
  }

  @Get('user/:userId')
  async getUserBookings(@Param('userId') userId: string): Promise<Booking[]> {
    return this.bookingService.findByUser(parseInt(userId));
  }

  @Get('room/:roomId')
  async getRoomBookings(@Param('roomId') roomId: string): Promise<Booking[]> {
    return this.bookingService.findByRoom(parseInt(roomId));
  }

  // DELETE conserva el registro como historial y devuelve status cancelled.
  @Delete(':id')
  async cancelBooking(@Param('id', ParseIntPipe) id: number): Promise<Booking> {
    return this.bookingService.cancel(id);
  }
}
