import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // pipe global: valida decoradores, descarta propiedades no declaradas y transforma tipos
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API Soporte TI - Región de Ñuble')
    .setDescription('Sistema de Gestión de Solicitudes de Soporte TI')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Servidor iniciado en http://localhost:${port}`);
  console.log(`Documentación Swagger en http://localhost:${port}/api`);
}
bootstrap();
