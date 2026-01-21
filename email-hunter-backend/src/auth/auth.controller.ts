import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ✅ SIGNUP (already correct)
  @Post('signup')
  signup(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.signup(email, password);
  }

  // ✅ LOGIN (just ADD this part)
  @Post('login')
  login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.login(email, password);
  }
}
