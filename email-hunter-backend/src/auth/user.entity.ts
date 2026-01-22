import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Email } from '../email/email.entity';

@Entity('users') // "user" reserved hota hai, is liye plural safe hai
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Email, (email) => email.user)
  emails: Email[];

  @CreateDateColumn()
  createdAt: Date;
}
