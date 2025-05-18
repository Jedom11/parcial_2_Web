import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ReseniaService } from './resenia.service';
import { Resenia } from './resenia.entity';
import { faker } from '@faker-js/faker/.';
import { Actividad } from '../actividad/actividad.entity';
import { Estudiante } from '../estudiante/estudiante.entity';

let reseniasList: Resenia[] = [];

const seedReseniasDatabase = async (repository: Repository<Resenia>) => {
  await repository.clear();
  reseniasList = [];

  for (let i = 0; i < 5; i++) {
    const actividad = await repository.save({
      comentario: faker.lorem.sentence(6),
      calificacion: faker.number.int({ min: 1, max: 5 }),
      fecha: faker.date.future().toISOString(),
    });
    reseniasList.push(actividad);
  }
};

describe('ReseniaService', () => {
  let service: ReseniaService;
  let repository: Repository<Resenia>;
  let repositoryEst: Repository<Estudiante>;
  let repositoryAct: Repository<Actividad>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ReseniaService],
    }).compile();

    service = module.get<ReseniaService>(ReseniaService);
    repositoryEst = module.get<Repository<Estudiante>>(getRepositoryToken(Estudiante));
    repositoryAct = module.get<Repository<Actividad>>(getRepositoryToken(Actividad));
    repository = module.get<Repository<Resenia>>(getRepositoryToken(Resenia));
    seedReseniasDatabase(repository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all resenias', async () => {
    const resenias: Resenia[] = await service.findAll();
    expect(resenias).not.toBeNull();
    expect(resenias).toHaveLength(reseniasList.length);
  });

  it('agregarReseña debería permitir agregar una reseña si el estudiante estuvo inscrito y la actividad está finalizada', async () => {
    // Crear una actividad con estado 2 (finalizada)
    const actividad = await repositoryAct.save({
      titulo: 'Actividad Finalizada',
      estado: 2,
      cupoMaximo: 10,
      fecha: '2025-05-18T00:00:00.000Z',
      inscritos: [] as Estudiante[], // se llena abajo
      resenias: [] as Resenia[],
    });

    // Crear un estudiante
    const estudiante = await repositoryEst.save({
      cedula: faker.number.int(),
      nombre: faker.person.firstName(),
      correo: faker.internet.email(),
      programa: faker.person.jobType(),
      semestre: faker.number.int({ min: 1, max: 10 }),
      actividades: [] as Actividad[],
      resenias: [] as Resenia[],
    });

    // Inscribir al estudiante en la actividad
    actividad.inscritos = [estudiante];
    const actividadResult = await repositoryAct.save(actividad);

    // Ejecutar agregarReseña
    const nuevaReseña = await service.agregarReseña(estudiante.id, actividadResult.id, {
      comentario: 'Excelente actividad',
      calificacion: 5,
      fecha: '2025-05-18T00:00:00.000Z',
    });

    // Verificaciones
    expect(nuevaReseña).toBeDefined();
    expect(nuevaReseña.comentario).toBe('Excelente actividad');
    expect(nuevaReseña.calificacion).toBe(5);
    expect(nuevaReseña.actividad.id).toBe(actividad.id);
    expect(nuevaReseña.estudiante.id).toBe(estudiante.id);
    expect(nuevaReseña.fecha).toBe('2025-05-18T00:00:00.000Z');
  });
});
