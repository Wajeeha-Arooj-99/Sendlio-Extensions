import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Email } from '../email/email.entity'
import { User } from '../auth/user.entity';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(Email)
    private emailRepository: Repository<Email>,
  ) {}

  async saveEmail(emailData: { address: string; url: string; pageTitle: string }, user: User) {
    const newEmail = this.emailRepository.create({
      ...emailData,
      user: user, // User ko link kar rahe hain
    });
    return this.emailRepository.save(newEmail);
  }

  // Jab aap "Saved Emails" fetch karna chahoge tab ye use hoga
  async getUserEmails(userId: number) {
    return this.emailRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }
}