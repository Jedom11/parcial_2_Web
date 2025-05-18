import { Controller, Get, Post } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { ActividadService } from 'src/actividad/actividad.service';

@Controller()
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService,
    private readonly actividadService: ActividadService
  ) {}

  @Post()
  inscribirseActividad(idActividad: number, idEstudiante: number) {
  }
}
