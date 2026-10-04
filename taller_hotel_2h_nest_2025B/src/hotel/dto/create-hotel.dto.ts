// Type permite convertir valores JSON numéricos antes de ejecutar sus validaciones.
import { Type } from 'class-transformer';
// Estos validadores rechazan hoteles incompletos y calificaciones fuera de escala.
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateHotelDto {
  // El nombre del hotel es obligatorio para identificar el establecimiento.
  @IsNotEmpty()
  name: string;

  // La ubicación descriptiva es necesaria para mostrar dónde queda el hotel.
  @IsNotEmpty()
  location: string;

  // Ciudad y país se exigen para que el hotel pueda ubicarse geográficamente.
  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  country: string;

  // Una calificación válida es numérica y siempre se mantiene entre cero y cinco.
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  // La descripción es opcional, pero si se proporciona debe ser texto.
  @IsOptional()
  @IsString()
  description?: string;
}
