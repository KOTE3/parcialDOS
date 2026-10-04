import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';
import { jwtSecret } from './jwt-secret';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // La misma configuración permite validar tokens firmados con la variable de entorno.
      secretOrKey: configService.get<string>('JWT_SECRET') ?? jwtSecret,
    });
  }

  async validate(payload: { id: number; email?: string }) {
    return this.userService.findById(payload.id);
  }
}
