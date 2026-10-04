import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto } from './create-room.dto';

// PartialType permite editar un campo sin exigir que el cliente reenvíe los demás.
export class UpdateRoomDto extends PartialType(CreateRoomDto) {}
