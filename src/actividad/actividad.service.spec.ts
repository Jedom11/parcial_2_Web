import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ActividadService } from './actividad.service';
import { Actividad } from './actividad.entity';

describe('ActividadService', () => {
 let service: ActividadService;
 let repository: Repository<Actividad>;

 beforeEach(async () => {
   const module: TestingModule = await Test.createTestingModule({
     imports: [...TypeOrmTestingConfig()],
     providers: [ActividadService],
   }).compile();

   service = module.get<ActividadService>(ActividadService);
   repository = module.get<Repository<Actividad>>(getRepositoryToken(Actividad));
 });
  
 it('should be defined', () => {
   expect(service).toBeDefined();
 });

});
