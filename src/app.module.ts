import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Solicitud } from './solicitudes/entities/solicitude.entity';
import { SolicitudesModule } from './solicitudes/solicitudes.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT ?? 3306),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'soporte_ti_db',
      entities: [Solicitud],
      synchronize: true, // Sincroniza la tabla 'solicitudes' automáticamente en desarrollo
    }),
    SolicitudesModule,
  ],
})
export class AppModule {}