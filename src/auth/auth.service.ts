import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { google } from 'googleapis';

@Injectable()
export class AuthService {
  private oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      const passwordMatch = await bcrypt.compare(pass, user.password);
      return passwordMatch ? user : null;
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
    return this.usersService.create(userData);
  }

  // Método para obtener el token de Google
  async getGoogleToken(code: string) {
    const response = await this.oauth2Client.getToken(code);
    return response.tokens;
  }

  // Método para obtener información del usuario desde Google
  async getGoogleUserInfo(accessToken: string) {
    this.oauth2Client.setCredentials({ access_token: accessToken });
    const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client });
    const { data } = await oauth2.userinfo.get();
    return data;
  }

  // Método de autenticación con Google
  async googleLogin(user: any) {
    let existingUser = await this.usersService.findOneByEmail(user.email);
    if (!existingUser) {
      const createUserDto = {
        email: user.email,
        password: 'google-auth',
      };
      existingUser = await this.usersService.create(createUserDto);
    }
  
    // Crear un token JWT para el usuario autenticado
    const payload = { email: existingUser.email, sub: existingUser.id };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1h',
      }),
    };
  }
  
  // Nuevo método para generar un token alternativo
  async createAlternativeToken(email: string) {
    const payload = { email: email, sub: 'alternative-id' };
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });
  }

  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }
}