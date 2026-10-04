import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from '../booking/booking.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  // El serializador global evita entregar incluso el hash cuando se devuelve un usuario.
  @Exclude()
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // El cascade remove del ORM acompaña a la eliminación en cascada configurada en la FK.
  @OneToMany(() => Booking, (booking) => booking.user, { cascade: ['remove'] })
  bookings: Booking[];
}
