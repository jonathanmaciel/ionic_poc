import { DomainException } from 'src/app/domain/exceptions/domain-exception';

export class ContactNameEqualException extends DomainException {

  static readonly code: number = 508;

  constructor() {
    super('O nome esta vinculado a outro contato.');
  }
}