import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';
import { Solicitud } from './solicitudes/entities/solicitude.entity';

// creamos seed.ts para probar los filtros de busqueda y las resticciones de estado

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const repo = dataSource.getRepository(Solicitud);

  // limpieza previa opcional para pruebas repetibles
  await repo.clear();

  const datosSemilla = [
    {
      titulo: 'Falla masiva en enlace de fibra óptica',
      cliente: 'Hospital Clínico Herminda Martín',
      categoria: 'Redes',
      prioridad: 'Crítica',
      estado: 'Pendiente',
      descripcion: 'Corte de conectividad en el pabellón central tras trabajos externos.',
      fechaSolicitud: '2026-09-10',
    },
    {
      titulo: 'Renovación de licencias de antivirus corporativo',
      cliente: 'Agrícola San Carlos S.A.',
      categoria: 'Seguridad',
      prioridad: 'Alta',
      estado: 'En Proceso',
      descripcion: 'Actualización y enrolamiento de 25 estaciones de trabajo operativas.',
      fechaSolicitud: '2026-09-08',
    },
    {
      titulo: 'Impresora térmica de tickets no enciende',
      cliente: 'Comercializadora Chillán Express',
      categoria: 'Hardware',
      prioridad: 'Media',
      estado: 'Finalizada',
      descripcion: 'Se realizó sustitución de fuente de poder dañada por sobretensión eléctrica.',
      fechaSolicitud: '2026-09-05',
    },
    {
      titulo: 'Error en cálculo de IVA del sistema contable',
      cliente: 'Consultores Tributarios Ñuble',
      categoria: 'Software',
      prioridad: 'Alta',
      estado: 'Pendiente',
      descripcion: 'El módulo emite inconsistencias numéricas al generar el informe mensual.',
      fechaSolicitud: '2026-09-11',
    },
    {
      titulo: 'Configuración de cuenta de correo en nuevo equipo',
      cliente: 'Servicios Logísticos San Nicolás',
      categoria: 'Soporte Usuario',
      prioridad: 'Baja',
      estado: 'Finalizada',
      descripcion: 'Instalación de perfiles corporativos y capacitación básica al operario.',
      fechaSolicitud: '2026-09-02',
    },
  ];

  await repo.save(datosSemilla);
  console.log('BD "soporte_ti_db" poblada con registros semilla para pruebas');
  await app.close();
}
bootstrap();

