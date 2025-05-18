import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Resenia } from '../resenia/resenia.entity';
import { Actividad } from '../actividad/actividad.entity';
import { ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Estudiante {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int' })
  cedula: number;

  @Column()
  nombre: string;

  @Column()
  correo: string;

  @Column()
  programa: string;

  @Column({ type: 'int' })
  semestre: number;

  @OneToMany(() => Resenia, (resenia) => resenia.estudiante)
  resenias: Resenia[];

  @ManyToMany(() => Actividad, (actividad) => actividad.inscritos)

  @JoinTable()
  
  actividades: Actividad[];
}
