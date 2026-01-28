import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      // Token kahan se aayega? (Header se)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Secret key jo env file mein hy
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  // Token validate hone ke baad ye function chalega
  async validate(payload: any) {
    // Payload se User ID nikaal kar DB se user dhundho
    const user = await this.userRepository.findOne({ 
        where: { id: payload.sub } 
    });
    
    if (!user) {
        throw new Error('User not found');
    }
    
    return user; // Ye user req.user mein chala jayega
  }
}