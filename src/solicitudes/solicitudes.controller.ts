import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateSolicitudDto } from './dto/create-solicitude.dto';
import { UpdateSolicitudDto } from './dto/update-solicitude.dto';
import { SolicitudesService } from './solicitudes.service';

@ApiTags('solicitudes')
@Controller('solicitudes')
export class SolicitudesController {
  constructor(private readonly solicitudesService: SolicitudesService) {}

  @Post()
  create(@Body() createDto: CreateSolicitudDto) {
    return this.solicitudesService.create(createDto);
  }

  @Get()
  findAll() {
    return this.solicitudesService.findAll();
  }

  @Get('buscar')
  @ApiQuery({ name: 'estado', required: false })
  @ApiQuery({ name: 'prioridad', required: false })
  @ApiQuery({ name: 'categoria', required: false })
  buscar(
    @Query('estado') estado?: string,
    @Query('prioridad') prioridad?: string,
    @Query('categoria') categoria?: string,
  ) {
    return this.solicitudesService.buscar(estado, prioridad, categoria);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.solicitudesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSolicitudDto,
  ) {
    return this.solicitudesService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.solicitudesService.remove(id);
  }
}
