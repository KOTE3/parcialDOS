import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  // El correo sirve para localizar la cuenta con la que se solicita iniciar sesión.
  @IsEmail()
  email: string;

  // La contraseña se verifica contra el hash guardado, nunca se almacena nuevamente.
  @IsString()
  @IsNotEmpty()
  password: string;
}
