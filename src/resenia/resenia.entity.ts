import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Estudiante } from '../estudiante/estudiante.entity';
import { Actividad } from '../actividad/actividad.entity';

@Entity()
export class Resenia {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  comentario: string;

  @Column({ type: 'int' })
  calificacion: number;

  @Column()
  fecha: string;

  @ManyToOne(() => Estudiante, (estudiante) => estudiante.resenias, { onDelete: 'CASCADE' })
  estudiante: Estudiante;

  @ManyToOne(() => Actividad, (actividad) => actividad.resenias, { onDelete: 'CASCADE' })
  actividad: Actividad;
}
