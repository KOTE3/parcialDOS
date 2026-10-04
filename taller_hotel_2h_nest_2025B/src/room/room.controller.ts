import { Controller, Post, Get, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './room.entity';

@Controller('hotels/:hotelId/rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  async createRoom(
    @Param('hotelId', ParseIntPipe) hotelId: number,
    @Body() createRoomDto: CreateRoomDto,
  ): Promise<Room> {
    return this.roomService.create(hotelId, createRoomDto);
  }

  @Get()
  async getAllRooms(@Param('hotelId', ParseIntPipe) hotelId: number): Promise<Room[]> {
    return this.roomService.findAll(hotelId);
  }

  // La ruta fija va antes de :id para que "available" no se interprete como número.
  @Get('available')
  async getAvailableRooms(
    @Param('hotelId', ParseIntPipe) hotelId: number,
  ): Promise<Room[]> {
    return this.roomService.getAvailability(hotelId);
  }

  @Get(':id')
  async getRoom(@Param('id', ParseIntPipe) id: number): Promise<Room> {
    return this.roomService.findOne(id);
  }

  // PUT delega la actualización y devuelve el registro persistido.
  @Put(':id')
  async updateRoom(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateRoomDto,
  ): Promise<Room> {
    return this.roomService.update(id, updateData);
  }

  // DELETE informa el resultado y propaga 404 para ids inexistentes.
  @Delete(':id')
  async deleteRoom(@Param('id', ParseIntPipe) id: number): Promise<{ success: boolean }> {
    return { success: await this.roomService.delete(id) };
  }
}
