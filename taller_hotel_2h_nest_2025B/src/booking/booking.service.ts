import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, Not, Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { RoomService } from '../room/room.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    // Se consulta RoomService para obtener precio y validar existencia/disponibilidad.
    private readonly roomService: RoomService,
  ) {}

  async create(userId: number, createBookingDto: CreateBookingDto): Promise<Booking> {
    // Se normalizan las fechas para poder comparar límites y calcular noches.
    const checkInDate = new Date(createBookingDto.checkInDate);
    const checkOutDate = new Date(createBookingDto.checkOutDate);
    if (
      Number.isNaN(checkInDate.getTime()) ||
      Number.isNaN(checkOutDate.getTime()) ||
      checkOutDate <= checkInDate
    ) {
      throw new BadRequestException('Check-out date must be after check-in date');
    }

    // Cargar la habitación permite validar su estado y usar su tarifa real.
    const room = await this.roomService.findOne(createBookingDto.roomId);
    if (!room.available) {
      throw new BadRequestException('Room is not available');
    }
    if (
      await this.hasDateConflict(
        createBookingDto.roomId,
        checkInDate,
        checkOutDate,
      )
    ) {
      throw new BadRequestException('Room is already booked for the selected dates');
    }

    // Se cobra una tarifa por cada noche; el día de salida no cuenta como noche.
    const numberOfNights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (24 * 60 * 60 * 1000),
    );
    const totalPrice = numberOfNights * room.pricePerNight;

    // TypeORM enlaza relaciones usando propiedades de entidad, no el campo roomId suelto.
    const booking = this.bookingsRepository.create({
      ...createBookingDto,
      checkInDate,
      checkOutDate,
      room: { id: createBookingDto.roomId },
      user: { id: userId },
      status: 'pending',
      totalPrice,
    });

    return this.bookingsRepository.save(booking);
  }

  async findOne(id: number): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: ['room', 'user'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }

    return booking;
  }

  async findByUser(userId: number): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { user: { id: userId } },
      relations: ['room', 'user'],
    });
  }

  async findByRoom(roomId: number): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { room: { id: roomId } },
      relations: ['room', 'user'],
    });
  }

  // Cambia el estado sin borrar el historial y devuelve la reserva ya modificada.
  async cancel(id: number): Promise<Booking> {
    await this.findOne(id);
    await this.bookingsRepository.update(id, { status: 'cancelled' });
    return this.findOne(id);
  }

  // Dos intervalos se cruzan cuando el existente inicia antes de la salida nueva y termina después de su llegada.
  async hasDateConflict(
    roomId: number,
    checkInDate: Date,
    checkOutDate: Date,
  ): Promise<boolean> {
    if (checkOutDate <= checkInDate) {
      throw new BadRequestException('Check-out date must be after check-in date');
    }
    const bookings = await this.bookingsRepository.find({
      where: {
        room: { id: roomId },
        status: Not('cancelled'),
        checkInDate: LessThan(checkOutDate),
        checkOutDate: MoreThan(checkInDate),
      },
    });
    return bookings.length > 0;
  }

  // Recupera reservas activas que se solapan con el intervalo consultado.
  async getBookingsByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<Booking[]> {
    if (endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }
    return this.bookingsRepository.find({
      where: {
        status: Not('cancelled'),
        checkInDate: LessThan(endDate),
        checkOutDate: MoreThan(startDate),
      },
      relations: ['room', 'user'],
    });
  }
}
