import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
// columnas de la tabla solcitudes de la base de datos soporte_ti_bd - 8 columnas 

@Entity('solicitudes')
export class Solicitud {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 50})
  titulo: string;

  @Column({length: 50})
  cliente: string;

  @Column({length: 50})
  categoria: string;

  @Column({length: 20})
  prioridad: string;

  @Column({length: 20, default: 'Pendiente'})
  estado: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'date' })
  fechaSolicitud: string;
}