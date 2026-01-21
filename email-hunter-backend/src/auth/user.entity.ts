import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Email } from '../email/email.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  // @OneToMany(() => Email, (email) => email.user)
  // emails: Email[];

  @CreateDateColumn()
  createdAt: Date;
}
