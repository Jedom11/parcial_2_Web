import { Module } from '@nestjs/common';
import { ReseniaService } from './resenia.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estudiante } from 'src/estudiante/estudiante.entity';
import { Actividad } from 'src/actividad/actividad.entity';
import { Resenia } from './resenia.entity';
import { ReseniaController } from './resenia.controller';

@Module({
  imports: [
      TypeOrmModule.forFeature([Estudiante, Actividad, Resenia]),
    ],
  providers: [ReseniaService],
  controllers: [ReseniaController],
})
export class ReseniaModule {}
