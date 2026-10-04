// Estos decoradores validan tipos y campos antes de que el servicio guarde usuarios.
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  // Solo se aceptan direcciones con formato de correo electrónico.
  @IsEmail()
  email: string;

  // La clave debe ser texto no vacío y tener longitud suficiente para el hash.
  @IsString()
  @MinLength(8)
  password: string;

  // El nombre debe ser texto y no puede omitirse ni quedar vacío.
  @IsString()
  @IsNotEmpty()
  name: string;

  // El teléfono se puede omitir, pero si llega debe ser una cadena.
  @IsOptional()
  @IsString()
  phone?: string;
}
