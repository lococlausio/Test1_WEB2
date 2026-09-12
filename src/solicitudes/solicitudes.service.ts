import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSolicitudDto } from './dto/create-solicitude.dto';
import { UpdateSolicitudDto } from './dto/update-solicitude.dto';
import { Solicitud } from './entities/solicitude.entity';

@Injectable()
export class SolicitudesService {
  constructor(
    @InjectRepository(Solicitud)
    private readonly solicitudRepo: Repository<Solicitud>,
  ) {}

  // toda nueva solicitud se crea obligatoriamente con estado pendiente
  async create(dto: CreateSolicitudDto): Promise<Solicitud> {
    const nuevaSolicitud = this.solicitudRepo.create({
      ...dto,
      estado: 'Pendiente', // forzado para dejar la nueva solicitud como pendiente
    });
    return await this.solicitudRepo.save(nuevaSolicitud);
  }

  async findAll(): Promise<Solicitud[]> {
    return await this.solicitudRepo.find();
  }

  // si el id es inexistente retorna 404
  async findOne(id: number): Promise<Solicitud> {
    const solicitud = await this.solicitudRepo.findOne({ where: { id } });
    if (!solicitud) {
      throw new NotFoundException({
        statusCode: 404,
        error: 'Not Found',
        message: `solicitud con ID ${id} no existe en el sistema`,
      });
    }
    return solicitud;
  }

  // búsqueda combinada estado, prioridad y/o categoria
  async buscar(estado?: string, prioridad?: string, categoria?: string): Promise<Solicitud[]> {
    const qb = this.solicitudRepo.createQueryBuilder('s');

    if (estado) {
      qb.andWhere('LOWER(s.estado) = LOWER(:estado)', { estado });
    }
    if (prioridad) {
      qb.andWhere('LOWER(s.prioridad) = LOWER(:prioridad)', { prioridad });
    }
    if (categoria) {
      qb.andWhere('LOWER(s.categoria) = LOWER(:categoria)', { categoria });
    }

    return await qb.getMany();
  }

  // validaciones de transición de estado e ID
  async update(id: number, dto: UpdateSolicitudDto): Promise<Solicitud> {
    const solicitud = await this.findOne(id); // esto valida existencia 

    // si está finalizada, no puede volver a Pendiente
    if (solicitud.estado === 'Finalizada' && dto.estado === 'Pendiente') {
      throw new BadRequestException({
        statusCode: 400,
        error: 'Bad Request',
        message: 'solicitud finalizada no puede retornar al estado pendiente',
      });
    }

    Object.assign(solicitud, dto);
    return await this.solicitudRepo.save(solicitud);
  }

  // restricción de eliminación por estado
  async remove(id: number): Promise<{ mensaje: string; id: number }> {
    const solicitud = await this.findOne(id); // valida existencia 

    // si está en proceso, no puede ser eliminada solo se permite en finalizada
    if (solicitud.estado === 'En Proceso') {
      throw new BadRequestException({
        statusCode: 400,
        error: 'Bad Request',
        message: 'solicitud en estado en proceso no puede ser eliminada primero debe encontrarse finalizada',
      });
    }

    await this.solicitudRepo.remove(solicitud);
    return {
      mensaje: `Solicitud con ID ${id} eliminada exitosamente.`,
      id,
    };
  }
}