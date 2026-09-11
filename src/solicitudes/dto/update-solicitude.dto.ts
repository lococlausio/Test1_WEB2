import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { CreateSolicitudDto } from './create-solicitude.dto';

export const ESTADOS = ['Pendiente', 'En Proceso', 'Finalizada'] as const;
export type Estado = (typeof ESTADOS)[number];

export class UpdateSolicitudDto extends PartialType(CreateSolicitudDto) {
  @ApiPropertyOptional({ enum: ESTADOS })
  @IsOptional()
  @IsIn(ESTADOS as unknown as string[])
  estado?: Estado;
}