import { TypeOrmModule } from '@nestjs/typeorm';
import { Actividad } from '../../actividad/actividad.entity';
import { Estudiante } from '../../estudiante/estudiante.entity';
import { Resenia } from '../../resenia/resenia.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [Actividad, Estudiante, Resenia],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([Actividad, Estudiante, Resenia]),
];
