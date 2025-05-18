import { InjectRepository } from '@nestjs/typeorm';
import { Resenia } from './resenia.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Estudiante } from '../estudiante/estudiante.entity';
import { Actividad } from '../actividad/actividad.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../errors/business-errors';

@Injectable()
export class ReseniaService {
  constructor(
    @InjectRepository(Resenia) private reseniaRepo: Repository<Resenia>,
    @InjectRepository(Estudiante) private estudianteRepo: Repository<Estudiante>,
    @InjectRepository(Actividad) private actividadRepo: Repository<Actividad>,
  ) {}

  /**
   * BASIC CRUD
   */

  // GET ALL
  async findAll(): Promise<Resenia[]> {
    return await this.reseniaRepo.find({
      relations: ['estudiante', 'actividad'],
    });
  }
  // GET BY ID
  async findOne(id: number): Promise<Resenia> {
    const resenia: Resenia | null = await this.reseniaRepo.findOne({
      where: { id },
      relations: ['estudiante', 'actividad'],
    });
    if (!resenia) {
      throw new BusinessLogicException(
        'La reseña con el dado id no se encontró',
        BusinessError.NOT_FOUND,
      );
    }
    return resenia;
  }
  // CREATE
  async create(resenia: Resenia): Promise<Resenia> {
    return await this.reseniaRepo.save(resenia);
  }
  // UPDATE
  async update(id: number, resenia: Resenia): Promise<Resenia> {
    const persistedResenia: Resenia | null =
      await this.reseniaRepo.findOne({ where: { id } });
    if (!persistedResenia)
      throw new BusinessLogicException(
        'La estudiante con el dado id no se encontró',
        BusinessError.NOT_FOUND,
      );

    return await this.estudianteRepo.save({
      ...persistedResenia,
      ...resenia,
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

  async agregarReseña(
    estudianteId: number,
    actividadId: number,
    data: Partial<Resenia>,
  ): Promise<Resenia> {
    const estudiante = await this.estudianteRepo.findOne({
      where: { id: estudianteId },
      relations: ['actividades'],
    });
    const actividad = await this.actividadRepo.findOne({
      where: { id: actividadId },
    });

    if (!estudiante || !actividad)
      throw new NotFoundException('Estudiante o actividad no encontrada');

    const inscrito = estudiante.actividades.some((a) => a.id === actividad.id);
    if (!inscrito)
      throw new BadRequestException(
        'El estudiante no participó en la actividad',
      );

    if (actividad.estado !== 2) {
      throw new BadRequestException(
        'Solo se puede reseñar actividades finalizadas',
      );
    }

    const reseña = this.reseniaRepo.create({ ...data, estudiante, actividad });
    return this.reseniaRepo.save(reseña);
  }
}
