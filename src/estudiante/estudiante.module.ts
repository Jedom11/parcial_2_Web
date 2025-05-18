import { Module } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { Actividad } from 'src/actividad/actividad.entity';
import { Estudiante } from './estudiante.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteController } from './estudiante.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([Estudiante, Actividad]),
  ],
  providers: [EstudianteService],
  controllers: [EstudianteController],
})
export class EstudianteModule {}
