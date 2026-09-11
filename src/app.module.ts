import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SolicitudesModule } from './solicitudes/solicitudes.module';

@Module({
  imports: [SolicitudesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
