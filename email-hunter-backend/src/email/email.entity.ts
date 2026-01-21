import { User } from 'src/auth/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity('emails')
export class Email {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ nullable: true })
  sourceUrl: string;

  // @ManyToOne(() => User, (user) => user.emails, {
  //   onDelete: 'CASCADE',
  // })
  // user: User;

  @CreateDateColumn()
  createdAt: Date;
}
