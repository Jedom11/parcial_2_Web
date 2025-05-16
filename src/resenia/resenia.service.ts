import { InjectRepository } from "@nestjs/typeorm";
import { Resenia } from "./resenia.entity";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Estudiante } from "src/estudiante/estudiante.entity";
import { Actividad } from "src/actividad/actividad.entity";
import { Repository } from "typeorm";

@Injectable()
export class ReseñaService {
  constructor(
    @InjectRepository(Resenia) private reseñaRepo: Repository<Resenia>,
    @InjectRepository(Estudiante) private estudianteRepo: Repository<Estudiante>,
    @InjectRepository(Actividad) private actividadRepo: Repository<Actividad>,
  ) {}

  async agregarReseña(estudianteId: number, actividadId: number, data: Partial<Resenia>): Promise<Resenia> {
    const estudiante = await this.estudianteRepo.findOne({ where: { id: estudianteId }, relations: ['actividades'] });
    const actividad = await this.actividadRepo.findOne({ where: { id: actividadId } });

    if (!estudiante || !actividad) throw new NotFoundException('Estudiante o actividad no encontrada');

    const inscrito = estudiante.actividades.some(a => a.id === actividad.id);
    if (!inscrito) throw new BadRequestException('El estudiante no participó en la actividad');

    if (actividad.estado !== 2) {
      throw new BadRequestException('Solo se puede reseñar actividades finalizadas');
    }

    const reseña = this.reseñaRepo.create({ ...data, estudiante, actividad });
    return this.reseñaRepo.save(reseña);
  }
}
