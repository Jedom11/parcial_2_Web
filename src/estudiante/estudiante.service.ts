import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Estudiante } from "./estudiante.entity";
import { Actividad } from "src/actividad/actividad.entity";
import { Repository } from "typeorm";

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(Estudiante) private estudianteRepo: Repository<Estudiante>,
    @InjectRepository(Actividad) private actividadRepo: Repository<Actividad>,
  ) {}

  async crearEstudiante(data: Partial<Estudiante>): Promise<Estudiante> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.correo || !emailRegex.test(data.correo)) throw new BadRequestException('Correo inválido');

    if (typeof data.semestre !== 'number' || data.semestre < 1 || data.semestre > 10) {
      throw new BadRequestException('Semestre debe estar entre 1 y 10');
    }

    const estudiante = this.estudianteRepo.create(data);
    return this.estudianteRepo.save(estudiante);
  }

  async findEstudianteById(id: number): Promise<Estudiante> {
    const estudiante = await this.estudianteRepo.findOne({ where: { id }, relations: ['actividades'] });
    if (!estudiante) throw new NotFoundException('Estudiante no encontrado');
    return estudiante;
  }

  async inscribirseActividad(estudianteId: number, actividadId: number): Promise<string> {
    const estudiante = await this.estudianteRepo.findOne({ where: { id: estudianteId }, relations: ['actividades'] });
    const actividad = await this.actividadRepo.findOne({ where: { id: actividadId }, relations: ['estudiantes'] });

    if (!estudiante || !actividad) throw new NotFoundException('Estudiante o Actividad no encontrada');

    if (actividad.estado !== 0) throw new BadRequestException('La actividad no está abierta');

    if (actividad.estudiantes.length >= actividad.cupoMaximo) {
      throw new BadRequestException('No hay cupo disponible');
    }

    const yaInscrito = actividad.estudiantes.some(e => e.id === estudiante.id);
    if (yaInscrito) throw new BadRequestException('Ya estás inscrito en esta actividad');

    actividad.estudiantes.push(estudiante);
    await this.actividadRepo.save(actividad);
    return 'Inscripción exitosa';
  }
}
