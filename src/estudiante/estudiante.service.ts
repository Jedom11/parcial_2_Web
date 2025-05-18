import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Estudiante } from './estudiante.entity';
import { Actividad } from '../actividad/actividad.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../errors/business-errors';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(Estudiante)
    private estudianteRepo: Repository<Estudiante>,
    @InjectRepository(Actividad) private actividadRepo: Repository<Actividad>,
  ) {}

  /**
   * BASIC CRUD
   */

  // GET ALL
  async findAll(): Promise<Estudiante[]> {
    return await this.estudianteRepo.find({
      relations: ['resenias', 'actividades'],
    });
  }
  // GET BY ID
  async findOne(id: number): Promise<Estudiante> {
    const estudiante: Estudiante | null = await this.estudianteRepo.findOne({
      where: { id },
      relations: ['resenias', 'actividades'],
    });
    if (!estudiante) {
      throw new BusinessLogicException(
        'El estudiante con el dado id no se encontró',
        BusinessError.NOT_FOUND,
      );
    }
    return estudiante;
  }
  // CREATE
  async create(estudiante: Estudiante): Promise<Estudiante> {
    return await this.estudianteRepo.save(estudiante);
  }
  // UPDATE
  async update(id: number, estudiante: Estudiante): Promise<Estudiante> {
    const persistedStudent: Estudiante | null =
      await this.estudianteRepo.findOne({ where: { id } });
    if (!persistedStudent)
      throw new BusinessLogicException(
        'La estudiante con el dado id no se encontró',
        BusinessError.NOT_FOUND,
      );

    return await this.estudianteRepo.save({
      ...persistedStudent,
      ...estudiante,
    });
  }

  //DELETE
  async delete(id: number) {
    const estudiante: Estudiante | null = await this.estudianteRepo.findOne({
      where: { id },
    });
    if (!estudiante)
      throw new BusinessLogicException(
        'El estudiante con el dado id no se encontró',
        BusinessError.NOT_FOUND,
      );

    await this.estudianteRepo.remove(estudiante);
  }

  async crearEstudiante(data: Partial<Estudiante>): Promise<Estudiante> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.correo || !emailRegex.test(data.correo))
      throw new BadRequestException('Correo inválido');

    if (
      typeof data.semestre !== 'number' ||
      data.semestre < 1 ||
      data.semestre > 10
    ) {
      throw new BadRequestException('Semestre debe estar entre 1 y 10');
    }

    const estudiante = this.estudianteRepo.create(data);
    return this.estudianteRepo.save(estudiante);
  }

  async findEstudianteById(id: number): Promise<Estudiante> {
    const estudiante = await this.estudianteRepo.findOne({
      where: { id },
      relations: ['actividades'],
    });
    if (!estudiante) throw new NotFoundException('Estudiante no encontrado');
    return estudiante;
  }

  async inscribirseActividad(
    estudianteId: number,
    actividadId: number,
  ): Promise<Estudiante> {
    const estudiante = await this.estudianteRepo.findOne({
      where: { id: estudianteId },
      relations: ['actividades'],
    });
    const actividad = await this.actividadRepo.findOne({
      where: { id: actividadId },
      relations: ['inscritos'],
    });

    if (!estudiante || !actividad)
      throw new NotFoundException('Estudiante o Actividad no encontrada');

    if (actividad.estado !== 0)
      throw new BadRequestException('La actividad no está abierta');

    if (actividad.inscritos.length >= actividad.cupoMaximo) {
      throw new BadRequestException('No hay cupo disponible');
    }

    const yaInscrito = actividad.inscritos.some((e) => e.id === estudiante.id);
    if (yaInscrito)
      throw new BadRequestException('Ya estás inscrito en esta actividad');

    actividad.inscritos.push(estudiante);
    actividad.cupoMaximo -= 1;
    estudiante.actividades.push(actividad);
    return await this.estudianteRepo.save(estudiante);
  }
}
