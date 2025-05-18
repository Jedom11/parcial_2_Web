import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Actividad } from './actividad.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../errors/business-errors';

@Injectable()
export class ActividadService {
  constructor(
    @InjectRepository(Actividad) private actividadRepo: Repository<Actividad>,
  ) {}
  /**
   * BASIC CRUD
   */

  // GET ALL
  async findAll(): Promise<Actividad[]> {
    return await this.actividadRepo.find({
      relations: ['resenias', 'inscritos'],
    });
  }
  // GET BY ID
  async findOne(id: number): Promise<Actividad> {
    const actividad: Actividad | null = await this.actividadRepo.findOne({
      where: { id },
      relations: ['resenias', 'inscritos'],
    });
    if (!actividad) {
      throw new BusinessLogicException(
        'La actividad con el dado id no se encontró',
        BusinessError.NOT_FOUND,
      );
    }
    return actividad;
  }
  // CREATE
  async create(actividad: Actividad): Promise<Actividad> {
    return await this.actividadRepo.save(actividad);
  }
  // UPDATE
  async update(id: number, actividad: Actividad): Promise<Actividad> {
    const persistedActivity: Actividad | null =
      await this.actividadRepo.findOne({ where: { id } });
    if (!persistedActivity)
      throw new BusinessLogicException(
        'La actividad con el dado id no se encontró',
        BusinessError.NOT_FOUND,
      );

    return await this.actividadRepo.save({
      ...persistedActivity,
      ...actividad,
    });
  }

  //DELETE
  async delete(id: number) {
    const actividad: Actividad | null = await this.actividadRepo.findOne({
      where: { id },
    });
    if (!actividad)
      throw new BusinessLogicException(
        'La actividad con el dado id no se encontró',
        BusinessError.NOT_FOUND,
      );

    await this.actividadRepo.remove(actividad);
  }

  /**
   * EXAMN SERVICES
   */
  async crearActividad(data: Partial<Actividad>): Promise<Actividad> {
    const sinSimbolos = /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/;
    if (
      !data.titulo ||
      data.titulo.length < 15 ||
      !sinSimbolos.test(data.titulo)
    ) {
      throw new BadRequestException(
        'El título debe tener mínimo 15 letras y no debe tener símbolos',
      );
    }

    data.estado = 0;
    const actividad = this.actividadRepo.create(data);
    return this.actividadRepo.save(actividad);
  }

  async cambiarEstado(id: number, nuevoEstado: number): Promise<string> {
    const actividad = await this.actividadRepo.findOne({
      where: { id },
      relations: ['inscritos'],
    });
    if (!actividad) throw new NotFoundException('Actividad no encontrada');

    const porcentajeLleno = actividad.inscritos.length / actividad.cupoMaximo;
    if (nuevoEstado === 1 && porcentajeLleno < 0.8) {
      throw new BadRequestException(
        'Solo se puede cerrar si al menos 80% del cupo está lleno',
      );
    }
    if (
      nuevoEstado === 2 &&
      actividad.inscritos.length < actividad.cupoMaximo
    ) {
      throw new BadRequestException(
        'Solo se puede finalizar si el cupo está lleno',
      );
    }

    actividad.estado = nuevoEstado;
    await this.actividadRepo.save(actividad);
    return 'Estado actualizado';
  }

  async findAllActividadesByDate(fecha: string): Promise<Actividad[]> {
    return this.actividadRepo.find({ where: { fecha } });
  }
}
