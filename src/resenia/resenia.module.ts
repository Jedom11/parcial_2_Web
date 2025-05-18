import { Module } from '@nestjs/common';
import { ReseniaService } from './resenia.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estudiante } from 'src/estudiante/estudiante.entity';
import { Actividad } from 'src/actividad/actividad.entity';
import { Resenia } from './resenia.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([Estudiante, Actividad, Resenia]),
    ],
  providers: [ReseniaService]
})
export class ReseniaModule {}
