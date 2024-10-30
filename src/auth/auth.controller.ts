import { Controller, Post, UseGuards, Request, Body, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { GoogleAuthGuard } from './google-auth.guard';
import { LocalAuthGuard } from './auth.guard';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly usersService: UsersService,) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<{ access_token: string }> {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  //GOOGLE AUTH
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // El guard redirige a la autenticación de Google
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/redirect')
  async googleAuthRedirect(@Req() req, @Res() res) {
    const user = req.user; // Contiene la información del usuario

    // Guarda el usuario en la base de datos
    let existingUser = await this.usersService.findOneByEmail(user.email);
    if (!existingUser) {
      // Si el usuario no existe, lo creamos
      existingUser = await this.usersService.create({
        email: user.email,
        password: '', 
      
      });
    }

    const token = await this.authService.login(existingUser); // Genera el JWT

    // Redirige o devuelve la respuesta
    return res.redirect(`http://localhost:3000/success?token=${token.access_token}`); 
  }
}

