import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Actividad } from "./actividad.entity";
import { Repository } from "typeorm";

@Injectable()
export class ActividadService {
  constructor(
    @InjectRepository(Actividad) private actividadRepo: Repository<Actividad>,
  ) {}

  async crearActividad(data: Partial<Actividad>): Promise<Actividad> {
    const sinSimbolos = /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/;

    if (!data.titulo || data.titulo.length < 15 || !sinSimbolos.test(data.titulo)) {
      throw new BadRequestException('El título debe tener mínimo 15 letras y no debe tener símbolos');
    }

    data.estado = 0;
    const actividad = this.actividadRepo.create(data);
    return this.actividadRepo.save(actividad);
  }

  async cambiarEstado(id: number, nuevoEstado: number): Promise<string> {
    const actividad = await this.actividadRepo.findOne({ where: { id }, relations: ['estudiantes'] });
    if (!actividad) throw new NotFoundException('Actividad no encontrada');

    const porcentajeLleno = actividad.estudiantes.length / actividad.cupoMaximo;

    if (nuevoEstado === 1 && porcentajeLleno < 0.8) {
      throw new BadRequestException('Solo se puede cerrar si al menos 80% del cupo está lleno');
    }

    if (nuevoEstado === 2 && actividad.estudiantes.length < actividad.cupoMaximo) {
      throw new BadRequestException('Solo se puede finalizar si el cupo está lleno');
    }

    actividad.estado = nuevoEstado;
    await this.actividadRepo.save(actividad);
    return 'Estado actualizado';
  }

  async findAllActividadesByDate(fecha: string): Promise<Actividad[]> {
    return this.actividadRepo.find({ where: { fecha } });
  }
}
