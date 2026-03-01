import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

/**
 * Pipe que recorta espacios en blanco de strings en el body.
 * Se aplica antes de la validación.
 */
@Injectable()
export class TrimStringsPipe implements PipeTransform {
  private trim(value: unknown): unknown {
    if (typeof value === 'string') {
      return value.trim();
    }
    if (Array.isArray(value)) {
      return value.map((v) => this.trim(v));
    }
    if (value !== null && typeof value === 'object') {
      const trimmed: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(value)) {
        trimmed[k] = this.trim(v);
      }
      return trimmed;
    }
    return value;
  }

  transform(value: unknown, metadata: ArgumentMetadata): unknown {
    if (
      metadata.type === 'body' &&
      value !== null &&
      typeof value === 'object'
    ) {
      return this.trim(value);
    }
    return value;
  }
}
