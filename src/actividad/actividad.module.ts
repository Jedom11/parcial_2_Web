import { Module } from '@nestjs/common';
import { ActividadService } from './actividad.service';
import { Actividad } from './actividad.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [ActividadService],
  imports: [TypeOrmModule.forFeature([Actividad])],
})
export class ActividadModule {}
