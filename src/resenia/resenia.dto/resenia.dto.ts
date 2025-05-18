import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ReseniaDto {
  @IsString()
  @IsNotEmpty()
  readonly comentario: string;

  @IsInt()
  @IsNotEmpty()
  readonly calificacion: number;

  @IsString()
  @IsNotEmpty()
  readonly fecha: string;

  @IsInt()
  @IsNotEmpty()
  readonly estudianteId: number;

  @IsInt()
  @IsNotEmpty()
  readonly actividadId: number;
}