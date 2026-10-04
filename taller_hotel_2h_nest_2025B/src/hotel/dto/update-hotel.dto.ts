import { PartialType } from '@nestjs/mapped-types';
import { CreateHotelDto } from './create-hotel.dto';

// PartialType conserva los validadores de creación y vuelve opcionales todos los campos.
export class UpdateHotelDto extends PartialType(CreateHotelDto) {}
