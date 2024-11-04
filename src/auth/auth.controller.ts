import { Controller, Post, UseGuards, Request, Body, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { GoogleAuthGuard } from './google-auth.guard';
import { LocalAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService, 
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<{ access_token: string }> {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async googleAuth(@Req() req) {
    // GoogleAuthGuard redirige automáticamente a la página de inicio de sesión de Google.
  }

  @UseGuards(GoogleAuthGuard)
@Get('google/redirect')
async googleAuthRedirect(@Req() req, @Res() res) {
  try {
    const code = req.query.code;

    if (!code) {
      // Generar un token alternativo en caso de que el código no esté presente
      const altToken = await this.authService.createAlternativeToken('user@example.com');
      return res.redirect(`http://localhost:3001/auth/callback?token=${altToken}`);
    }

    const tokens = await this.authService.getGoogleToken(code);

    if (!tokens || !tokens.access_token) {
      // Generar un token alternativo si no se pudo obtener el token de Google
      const altToken = await this.authService.createAlternativeToken('user@example.com');
      return res.redirect(`http://localhost:3001/auth/callback?token=${altToken}`);
    }

    const userInfo = await this.authService.getGoogleUserInfo(tokens.access_token);
    const token = await this.authService.googleLogin(userInfo);

    return res.redirect(`http://localhost:3001/auth/callback?token=${token.access_token}`);
  } catch (error) {
    console.error('Error durante la autenticación con Google:', error);
    return res.status(500).send('Internal Server Error');
  }
}

}
