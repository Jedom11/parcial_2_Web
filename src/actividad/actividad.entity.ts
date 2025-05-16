import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Resenia } from 'src/resenia/resenia.entity';
import { Estudiante } from 'src/estudiante/estudiante.entity';

@Entity()
export class Actividad {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  titulo: string;

  @Column()
  fecha: string;

  @Column({ type: 'int' })
  cupoMaximo: number;

  @Column({ type: 'int' })
  estado: number;

  @OneToMany(() => Resenia, (resenia) => resenia.actividad)
  resenias: Resenia[];

  @ManyToMany(() => Estudiante, (estudiante) => estudiante.actividades)
  estudiantes: Estudiante[];
}
