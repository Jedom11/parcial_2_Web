import { IsEmail, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class EstudianteDto {
  @IsInt()
  @IsNotEmpty()
  readonly cedula: number;

  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsEmail()
  @IsNotEmpty()
  readonly correo: string;

  @IsString()
  @IsNotEmpty()
  readonly programa: string;

  @IsInt()
  @Min(1)
  @Max(10)
  @IsNotEmpty()
  readonly semestre: number;
}

export class InscripcionDto {
  @IsInt()
  @IsNotEmpty()
  estudianteId: number;

  @IsInt()
  @IsNotEmpty()
  actividadId: number;
} 