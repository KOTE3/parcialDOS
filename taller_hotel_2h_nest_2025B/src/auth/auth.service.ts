import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Comprueba credenciales y entrega un token que identifica al usuario autenticado.
  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    let user: User | undefined;
    try {
      user = await this.usersService.findOne(loginDto.email);
    } catch (error) {
      // Se responde igual ante correo inexistente y clave incorrecta para no revelar cuentas.
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException('Invalid email or password');
      }
      throw error;
    }

    if (!(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // El payload lleva solo el identificador necesario para resolver al usuario en JwtStrategy.
    return {
      accessToken: await this.jwtService.signAsync({
        id: user.id,
        email: user.email,
      }),
    };
  }
}
