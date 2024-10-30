import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    
  ) { console.log('JWT Secret:', process.env.JWT_SECRET);}

  async validateUser(email: string, pass: string): Promise<User | null> {
    console.log('Validando usuario:', email);
    const user = await this.usersService.findOneByEmail(email);
    console.log('Usuario encontrado:', user);
  
    if (user) {
      const passwordMatch = await bcrypt.compare(pass, user.password);
      console.log('Coincidencia de contraseña:', passwordMatch);
      
      if (passwordMatch) {
        return user;
      } else {
        console.log('Contraseña incorrecta');
      }
    }
    return null; 
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET, 
        expiresIn: '1h', 
      }),
    };
  }
  async register(userData: CreateUserDto): Promise<User> {
    userData.password = await bcrypt.hash(userData.password, 10); 
    console.log('Contraseña hasheada:', userData.password); 
    return this.usersService.create(userData); 
  }

  //GOOGLE LOGIN
  async googleLogin(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }
}