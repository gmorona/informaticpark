import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseIdPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const id = parseInt(value, 10);
    if (isNaN(id) || id < 1) {
      throw new BadRequestException(
        `Parámetro '${metadata.data}' debe ser un ID numérico válido`,
      );
    }
    return id;
  }
}
