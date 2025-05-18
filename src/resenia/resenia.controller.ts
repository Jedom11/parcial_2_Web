import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { ReseniaService } from './resenia.service';
import { ReseniaDto } from './resenia.dto/resenia.dto';
import { plainToInstance } from 'class-transformer';
import { Resenia } from './resenia.entity';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('resenia')
export class ReseniaController {
  constructor(private readonly reseniaService: ReseniaService) {}

  @Post()
  async agregarReseña(@Body() reseniaDto: ReseniaDto) {
    const resenia: Resenia = plainToInstance(Resenia, reseniaDto);
    const estudianteId = reseniaDto.estudianteId;
    const actividadId = reseniaDto.actividadId;
    return await this.reseniaService.agregarReseña(estudianteId, actividadId, resenia);
  }
} 