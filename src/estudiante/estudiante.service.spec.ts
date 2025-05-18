import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { EstudianteService } from './estudiante.service';
import { Estudiante } from './estudiante.entity';

describe('EstudianteService', () => {
 let service: EstudianteService;
 let repository: Repository<Estudiante>;

 beforeEach(async () => {
   const module: TestingModule = await Test.createTestingModule({
     imports: [...TypeOrmTestingConfig()],
     providers: [EstudianteService],
   }).compile();

   service = module.get<EstudianteService>(EstudianteService);
   repository = module.get<Repository<Estudiante>>(getRepositoryToken(Estudiante));
 });
  
 it('should be defined', () => {
   expect(service).toBeDefined();
 });

});
