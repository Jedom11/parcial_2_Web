import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ReseniaService } from './resenia.service';
import { Resenia } from './resenia.entity';


describe('ReseniaService', () => {
 let service: ReseniaService;
 let repository: Repository<Resenia>;

 beforeEach(async () => {
   const module: TestingModule = await Test.createTestingModule({
     imports: [...TypeOrmTestingConfig()],
     providers: [ReseniaService],
   }).compile();

   service = module.get<ReseniaService>(ReseniaService);
   repository = module.get<Repository<Resenia>>(getRepositoryToken(Resenia));
 });
  
 it('should be defined', () => {
   expect(service).toBeDefined();
 });

});
