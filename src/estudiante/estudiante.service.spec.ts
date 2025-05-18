import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { EstudianteService } from './estudiante.service';
import { Estudiante } from './estudiante.entity';
import { faker } from '@faker-js/faker';
import { Actividad } from '../actividad/actividad.entity';

let estudiantesList: Estudiante[] = [];

const seedEstudianteDatabase = async (repository: Repository<Estudiante>) => {
  await repository.clear();
  estudiantesList = [];

  for (let i = 0; i < 5; i++) {
    const estudiante = await repository.save({
      cedula: faker.number.int(),
      nombre: faker.person.firstName(),
      correo: faker.internet.email(),
      programa: faker.person.jobType(),
      semestre: faker.number.int({ min: 1, max: 10 }),
      actividades: [],
      resenias: [],
    });
    estudiantesList.push(estudiante);
  }
};

describe('EstudianteService', () => {
  let service: EstudianteService;
  let repository: Repository<Estudiante>;
  let repoActividad: Repository<Actividad>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EstudianteService],
    }).compile();

    service = module.get<EstudianteService>(EstudianteService);
    repository = module.get<Repository<Estudiante>>(
      getRepositoryToken(Estudiante),
    );
    repoActividad = module.get<Repository<Actividad>>(
      getRepositoryToken(Actividad),
    );
    await seedEstudianteDatabase(repository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all estudiantes', async () => {
    const estudiante: Estudiante[] = await service.findAll();
    expect(estudiante).not.toBeNull();
    expect(estudiante).toHaveLength(estudiantesList.length);
  });

  it('create a student should return a Estudiante', async () => {
    const estudiante: Estudiante = {
      id: 0,
      cedula: faker.number.int(),
      nombre: faker.person.firstName(),
      correo: faker.internet.email(),
      programa: faker.person.jobType(),
      semestre: faker.number.int({ min: 1, max: 10 }),
      actividades: [],
      resenias: [],
    };
    const newEstudiante: Estudiante = await service.create(estudiante);
    expect(newEstudiante).not.toBeNull();

    const storedEstudiante: Estudiante | null = await repository.findOne({
      where: { id: newEstudiante.id },
      relations: ['actividades', 'resenias'],
    });
    expect(storedEstudiante).not.toBeNull();
    expect(storedEstudiante!.actividades).toEqual(newEstudiante.actividades);
    expect(storedEstudiante!.cedula).toEqual(newEstudiante.cedula);
    expect(storedEstudiante!.correo).toEqual(newEstudiante.correo);
    expect(storedEstudiante!.nombre).toEqual(newEstudiante.nombre);
    expect(storedEstudiante!.programa).toEqual(newEstudiante.programa);
    expect(storedEstudiante!.resenias).toEqual(newEstudiante.resenias);
    expect(storedEstudiante!.semestre).toEqual(newEstudiante!.semestre);
  });
  it('find a student by id return a Estudiante', async () => {
    const storedEstudiante = estudiantesList[0];
    const estudiante: Estudiante = await service.findOne(storedEstudiante.id);
    expect(estudiante).not.toBeNull();
    expect(estudiante.actividades).toEqual(storedEstudiante.actividades);
    expect(estudiante.cedula).toEqual(storedEstudiante.cedula);
    expect(estudiante.correo).toEqual(storedEstudiante.correo);
    expect(estudiante.nombre).toEqual(storedEstudiante.nombre);
    expect(estudiante.programa).toEqual(storedEstudiante.programa);
    expect(estudiante.resenias).toEqual(storedEstudiante.resenias);
    expect(estudiante.semestre).toEqual(storedEstudiante.semestre);
  });

  it('no permite inscripción si la actividad no está abierta (estado !== 0)', async () => {
    const newActividad: Actividad = await repoActividad.save({
      cupoMaximo: 5,
      estado: 3,
      fecha: '20/05/2025',
      inscritos: [],
      resenias: [],
      titulo: faker.lorem.word({ length: { min: 1, max: 15 } }),
    });

    const savedEstudiante = estudiantesList[0];

    await expect(
      service.inscribirseActividad(savedEstudiante.id, newActividad.id),
    ).rejects.toThrow('La actividad no está abierta');

    const estudianteActualizado: Estudiante | null = await repository.findOne({
      where: { id: savedEstudiante.id },
      relations: ['actividades'],
    });

    expect(estudianteActualizado).not.toBeNull();
    expect(estudianteActualizado!.actividades.length).toBe(0);
  });
});
