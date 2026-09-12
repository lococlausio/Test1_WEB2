import { ApiProperty } from '@nestjs/swagger';
import {IsIn, IsISO8601, IsNotEmpty, IsString, MinLength, Validate, ValidationArguments, ValidatorConstraint,
  ValidatorConstraintInterface} from 'class-validator'; 
export const CATEGORIAS = [
  'Hardware',
  'Software',
  'Redes',
  'Seguridad',
  'Soporte_usuario'
] as const;
export const PRIORIDADES = ['Baja','Media','Alta','Critica'] as const;

export type Categoria = (typeof CATEGORIAS)[number];
export type Prioridad = (typeof PRIORIDADES)[number];

// validar del rn07 fecha posterior a la de hoy

@ValidatorConstraint({ name: 'isNotFutureDate', async: false })
export class IsNotFutureDateConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    if (!value) return false;
    const dateInput = new Date(value);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return dateInput <= today;
  }

  defaultMessage(args: ValidationArguments) {
    return 'La fecha de solicitud no puede ser posterior a la fecha actual.';
  }
}

export class CreateSolicitudDto {
  @ApiProperty() 
  @IsString() 
  @MinLength(5)
  titulo: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cliente: string;

  @ApiProperty({ enum: CATEGORIAS })
  @IsIn(CATEGORIAS as unknown as string[])
  categoria: Categoria;

  @ApiProperty({ enum: PRIORIDADES })
  @IsIn(PRIORIDADES as unknown as string[])
  prioridad: Prioridad;

  @ApiProperty()
  @IsString()
  @MinLength(15)
  descripcion: string;

  @ApiProperty()
  @IsISO8601({ strict: true })
  @Validate(IsNotFutureDateConstraint)
  fechaSolicitud: string;
}