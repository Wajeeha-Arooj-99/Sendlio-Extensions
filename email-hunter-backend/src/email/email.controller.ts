import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { EmailService } from './email.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('emails')
@UseGuards(JwtAuthGuard) // Sirf Login wale users hi access karenge
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post('save')
  async saveEmail(@Body() body: any, @Request() req) {
    // req.user sy User ID aayegi (JWT Guard se)
    return this.emailService.saveEmail(body, req.user);
  }

  @Get()
  async getEmails(@Request() req) {
    // User ki saari emails laayein
    return this.emailService.getUserEmails(req.user.id);
  }
}