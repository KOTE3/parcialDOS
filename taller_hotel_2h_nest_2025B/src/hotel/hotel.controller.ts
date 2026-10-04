import { BadRequestException, Controller, Post, Get, Body, Param, Put, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { Hotel } from './hotel.entity';

@Controller('hotels')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Post()
  async createHotel(@Body() createHotelDto: CreateHotelDto): Promise<Hotel> {
    return this.hotelService.create(createHotelDto);
  }

  @Get()
  async getAllHotels(): Promise<Hotel[]> {
    return this.hotelService.findAll();
  }

  // Se declaran rutas fijas antes de :id para no tratar "search" como identificador.
  @Get('search')
  async searchHotels(@Query('location') location: string): Promise<Hotel[]> {
    // Sin término de búsqueda no se ejecuta una consulta amplia accidental.
    if (!location?.trim()) {
      throw new BadRequestException('Location query parameter is required');
    }
    return this.hotelService.searchByLocation(location);
  }

  // Devuelve hoteles que tengan al menos una habitación disponible.
  @Get('available')
  async getAvailableHotels(): Promise<Hotel[]> {
    return this.hotelService.getAvailableHotels();
  }

  @Get(':id')
  async getHotel(@Param('id', ParseIntPipe) id: number): Promise<Hotel> {
    return this.hotelService.findOne(id);
  }

  // PUT delega la actualización y responde con los datos persistidos.
  @Put(':id')
  async updateHotel(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateHotelDto,
  ): Promise<Hotel> {
    return this.hotelService.update(id, updateData);
  }

  // DELETE expone el resultado real del borrado y conserva el error 404 del servicio.
  @Delete(':id')
  async deleteHotel(@Param('id', ParseIntPipe) id: number): Promise<{ success: boolean }> {
    return { success: await this.hotelService.delete(id) };
  }
}
