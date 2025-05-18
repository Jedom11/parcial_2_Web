import { IsIn, IsInt, IsISO8601, IsNotEmpty, IsString } from 'class-validator';

export class ActividadDto {
  @IsString()
  @IsNotEmpty()
  readonly titulo: string;

  @IsString()
  @IsNotEmpty()
  readonly fecha: string;

  @IsInt()
  @IsNotEmpty()
  readonly cupoMaximo: number;

  @IsInt()
  @IsNotEmpty()
  readonly estado: number;
}

export class CambiarEstadoDto {
  @IsInt()
  @IsNotEmpty()
  actividadId: number;
  @IsIn([0, 1, 2], { message: 'El estado debe ser 0, 1 o 2' })
  estado: number;
}