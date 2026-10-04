import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) {}

  async create(hotelId: number, createRoomDto: CreateRoomDto): Promise<Room> {
    const room = this.roomsRepository.create({
      ...createRoomDto,
      hotel: { id: hotelId },
    });

    return this.roomsRepository.save(room);
  }

  async findAll(hotelId: number): Promise<Room[]> {
    return this.roomsRepository.find({
      where: { hotel: { id: hotelId } },
    });
  }

  // Filtra por hotel y por el indicador disponible para la ruta /available.
  async getAvailability(hotelId: number): Promise<Room[]> {
    return this.roomsRepository.find({
      where: { hotel: { id: hotelId }, available: true },
    });
  }

  async findOne(id: number): Promise<Room> {
    const room = await this.roomsRepository.findOne({
      where: { id },
      relations: ['hotel', 'bookings'],
    });

    if (!room) {
      throw new NotFoundException(`Room with id ${id} not found`);
    }

    return room;
  }

  // Actualiza únicamente los campos recibidos y devuelve el registro persistido.
  async update(id: number, updateData: Partial<CreateRoomDto>): Promise<Room> {
    const result = await this.roomsRepository.update(id, updateData);
    if (!result.affected) {
      throw new NotFoundException(`Room with id ${id} not found`);
    }
    return this.findOne(id);
  }

  // Informa que un id inexistente no se pudo eliminar, en lugar de responder éxito falso.
  async delete(id: number): Promise<boolean> {
    const result = await this.roomsRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Room with id ${id} not found`);
    }
    return true;
  }

  // Permite compartir llegada/salida el mismo día, pero no noches ya reservadas.
  async isAvailableForDateRange(
    id: number,
    checkInDate: Date,
    checkOutDate: Date,
  ): Promise<boolean> {
    if (checkOutDate <= checkInDate) {
      throw new BadRequestException('Check-out date must be after check-in date');
    }
    const room = await this.findOne(id);
    return !room.bookings?.some(
      (booking) =>
        booking.status !== 'cancelled' &&
        booking.checkInDate < checkOutDate &&
        booking.checkOutDate > checkInDate,
    );
  }
}
