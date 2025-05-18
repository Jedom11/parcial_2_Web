import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EstudianteModule } from './estudiante/estudiante.module';
import { ActividadModule } from './actividad/actividad.module';
import { ReseniaModule } from './resenia/resenia.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estudiante } from './estudiante/estudiante.entity';
import { Actividad } from './actividad/actividad.entity';
import { Resenia } from './resenia/resenia.entity';

@Module({
  imports: [
    EstudianteModule,
    ActividadModule,
    ReseniaModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgre',
      database: 'events',
      entities: [
        Estudiante,
        Actividad,
        Resenia
      ],
      dropSchema: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
