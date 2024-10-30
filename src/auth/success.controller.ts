import { Controller, Get, Query } from '@nestjs/common';

@Controller('success')
export class SuccessController {
  @Get()
  getSuccess(@Query('token') token: string) {
    return {
      message: 'Autenticación exitosa',
      token: token,
    };
  }
}