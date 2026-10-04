// Type convierte valores JSON a números para validar y persistir sus tipos correctos.
import { Type } from 'class-transformer';
// Estos decoradores comprueban los datos necesarios para publicar una habitación.
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateRoomDto {
  // El número de habitación debe venir informado.
  @IsNotEmpty()
  roomNumber: string;

  // El tipo es obligatorio para clasificar la habitación en el hotel.
  @IsNotEmpty()
  type: string; // 'single', 'double', 'suite'

  // Precio y capacidad deben ser números positivos y la capacidad entera.
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  pricePerNight: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  capacity: number;

  // La disponibilidad puede modificarse en PUT y debe llegar como booleano.
  @IsOptional()
  @IsBoolean()
  available?: boolean;

  // Una descripción omitida no debe invalidar la creación o actualización.
  @IsOptional()
  @IsString()
  description?: string;
}
