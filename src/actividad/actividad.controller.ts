import { Body, Controller, Get, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { ActividadService } from './actividad.service';
import { Actividad } from './actividad.entity';
import { ActividadDto, CambiarEstadoDto } from './actividad.dto/actividad.dto';
import { plainToInstance } from 'class-transformer';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('actividad')
export class ActividadController {
  constructor(private readonly actividadService: ActividadService) {}

  @Get()
  async findAll() {
    return await this.actividadService.findAll();
  }

  @Get(':actividadId')
  async findOne(@Param('actividadId') actividadId: number) {
    return await this.actividadService.findOne(actividadId);
  }

  @Post()
  async create(@Body() actividadDto: ActividadDto) {
    const actividad: Actividad = plainToInstance(Actividad, actividadDto);
    return await this.actividadService.crearActividad(actividad)
  }

  @Put('estado')
  async cambiarEstado(@Body() cambiarEstadoDto: CambiarEstadoDto) {
    const { actividadId, estado } = cambiarEstadoDto;
    const mensaje = await this.actividadService.cambiarEstado(actividadId, estado);
    return { message: mensaje };
  }

  @Get('bydate')
  async findByDate(@Body('fecha') fecha: string): Promise<Actividad[]> {
    console.log("ERROR ACÁ?", fecha)
    return await this.actividadService.findAllActividadesByDate(fecha);
  }
}
