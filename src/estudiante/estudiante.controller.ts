import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { EstudianteService } from './estudiante.service';
import { EstudianteDto, InscripcionDto } from './estudiante.dto/estudiante.dto';
import { plainToInstance } from 'class-transformer';
import { Estudiante } from './estudiante.entity';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('estudiante')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Get()
  async findAll() {
    return await this.estudianteService.findAll();
  }

  @Get(':estudianteId')
  async findEstudianteById(@Param('estudianteId') estudianteId: number) {
    return await this.estudianteService.findOne(estudianteId);
  }

  @Post()
  async crearEstudiante(@Body() estudianteDto: EstudianteDto) {
    const estudiante: Estudiante = plainToInstance(Estudiante, estudianteDto);
    return await this.estudianteService.create(estudiante);
  }
  

  @Post('inscribir')
  async inscribirseActividad(@Body() inscripcionDto: InscripcionDto) {
    return await this.estudianteService.inscribirseActividad(
      inscripcionDto.estudianteId,
      inscripcionDto.actividadId,
    );
  }
}