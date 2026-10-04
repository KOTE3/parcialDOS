// Type permite convertir el identificador numérico que normalmente llega como texto.
import { Type } from 'class-transformer';
// Los decoradores bloquean identificadores inválidos y fechas mal formadas.
import { IsDate, IsInt, Min } from 'class-validator';

export class CreateBookingDto {
  // Se necesita un id entero positivo para asociar la reserva a una habitación.
  @Type(() => Number)
  @IsInt()
  @Min(1)
  roomId: number;

  // Type convierte las fechas ISO de HTTP a Date para validarlas y compararlas.
  @Type(() => Date)
  @IsDate()
  checkInDate: Date;

  @Type(() => Date)
  @IsDate()
  checkOutDate: Date;
}
