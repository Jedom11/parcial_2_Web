import { Module } from '@nestjs/common';
import { ActividadService } from './actividad.service';
import { Actividad } from './actividad.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActividadController } from './actividad.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Actividad])],
  providers: [ActividadService],
  controllers: [ActividadController],
})
export class ActividadModule {}
