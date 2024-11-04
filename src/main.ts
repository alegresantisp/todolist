import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:3001', // Asegúrate de que coincida con tu URL del frontend
    credentials: true,
  });

  await app.listen(3000); // Asegúrate de que esté escuchando en el puerto correcto
}
bootstrap();