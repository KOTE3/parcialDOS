import { randomBytes } from 'crypto';

// La misma clave se comparte entre firma y verificación; en producción se define JWT_SECRET.
export const jwtSecret =
  process.env.JWT_SECRET ?? randomBytes(32).toString('hex');
