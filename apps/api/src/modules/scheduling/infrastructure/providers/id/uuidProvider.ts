import { IdProvider } from '../../../application/ports/IdProvider';
import { randomUUID } from 'crypto';

export class UuidProvider implements IdProvider {
  next(): string {
    return randomUUID();
  }
}
