import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ActividadService } from './actividad.service';
import { Actividad } from './actividad.entity';
import { faker } from '@faker-js/faker/.';
import { Estudiante } from '../estudiante/estudiante.entity';
import { Resenia } from '../resenia/resenia.entity';

let actividadesList: Actividad[] = [];

const seedActividadDatabase = async (repository: Repository<Actividad>) => {
  await repository.clear();
  actividadesList = [];

  for (let i = 0; i < 5; i++) {
    const actividad = await repository.save({
      titulo: faker.lorem
        .words(4)
        .replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ ]/g, '')
        .substring(0, 25),
      fecha: faker.date.future().toISOString(),
      cupoMaximo: faker.number.int({ min: 1, max: 15 }),
      estado: faker.number.int(0),
      inscritos: [],
      resenias: [],
    });
    actividadesList.push(actividad);
  }
};

describe('ActividadService', () => {
  let service: ActividadService;
  let repository: Repository<Actividad>;
  let repositoryEst: Repository<Estudiante>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ActividadService],
    }).compile();

    service = module.get<ActividadService>(ActividadService);
    repository = module.get<Repository<Actividad>>(
      getRepositoryToken(Actividad),
    );
    repositoryEst = module.get<Repository<Estudiante>>(
      getRepositoryToken(Estudiante),
    );
    seedActividadDatabase(repository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all actividad', async () => {
    const actividad: Actividad[] = await service.findAll();
    expect(actividad).not.toBeNull();
    expect(actividad).toHaveLength(actividadesList.length);
  });
  it('create a activity should return a Actividad', async () => {
    const newActividad = {
      titulo: faker.lorem
        .words(4)
        .replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ ]/g, '')
        .substring(0, 25),
      fecha: faker.date.future().toISOString(),
      cupoMaximo: faker.number.int({ min: 1, max: 15 }),
      estado: faker.number.int(0),
      inscritos: [],
      resenias: [],
    };
    const result = await service.crearActividad(newActividad);
    expect(result.titulo).toEqual(newActividad.titulo);
    expect(result.cupoMaximo).toEqual(newActividad.cupoMaximo);
    expect(result.estado).toEqual(newActividad.estado);
    expect(result.fecha).toEqual(newActividad.fecha);
    expect(result.inscritos).toEqual(newActividad.inscritos);
    expect(result.resenias).toEqual(newActividad.resenias);
  });

  it('update state 0 to 1 with cupoMaximo < 80% should throw an error', async () => {
    const newActividad = await repository.save({
      titulo: faker.lorem
        .words(4)
        .replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ ]/g, '')
        .substring(0, 25),
      fecha: faker.date.future().toISOString(),
      cupoMaximo: 10,
      estado: 0,
      inscritos: [] as Estudiante[],
      resenias: [] as Resenia[],
    });

    const listFakerEst: Estudiante[] = [];

    for (let i = 0; i < 7; i++) {
      const estudiante = await repositoryEst.save({
        cedula: faker.number.int(),
        nombre: faker.person.firstName(),
        correo: faker.internet.email(),
        programa: faker.person.jobType(),
        semestre: faker.number.int({ min: 1, max: 10 }),
        actividades: [],
        resenias: [],
      });

      listFakerEst.push(estudiante);
    }

    newActividad.inscritos = listFakerEst as Estudiante[];
    const resultAct = await repository.save(newActividad);
    await expect(service.cambiarEstado(resultAct.id, 1)).rejects.toThrow("Solo se puede cerrar si al menos 80% del cupo está lleno");
  });

  it('should return all actividades with the given date', async () => {
      const targetDate = '2025-05-18T00:00:00.000Z';

      const actividadesMock: Actividad[] = [
        { id: 1, titulo: 'A', fecha: targetDate, estado: 0, cupoMaximo: 10, inscritos: [], resenias: [] },
        { id: 2, titulo: 'B', fecha: '2025-06-01T00:00:00.000Z', estado: 0, cupoMaximo: 10, inscritos: [], resenias: [] },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(
        actividadesMock.filter(a => a.fecha === targetDate),
      );

      const result = await service.findAllActividadesByDate(targetDate);

      expect(result).toHaveLength(1);
      expect(result[0].fecha).toBe(targetDate);
      expect(result[0].titulo).toBe('A');
    });
});
