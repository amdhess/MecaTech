import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File) {
    if (!value) {
      throw new BadRequestException('Arquivo não enviado');
    }

    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    if (!allowedMimes.includes(value.mimetype)) {
      throw new BadRequestException(
        'Tipo de arquivo inválido. Apenas JPEG, PNG e WebP são permitidos.',
      );
    }

    if (value.size > 5 * 1024 * 1024) {
      throw new BadRequestException('Arquivo muito grande. Máximo 5MB.');
    }

    return value;
  }
}
