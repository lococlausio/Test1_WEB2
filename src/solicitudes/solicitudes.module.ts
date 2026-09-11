import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Solicitud } from './entities/solicitude.entity';
import { SolicitudesController } from './solicitudes.controller';
import { SolicitudesService } from './solicitudes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Solicitud])],
  controllers: [SolicitudesController],
  providers: [SolicitudesService],
  exports: [SolicitudesService],
})
export class SolicitudesModule {}