import { DomainException } from 'src/app/domain/exceptions/domain-exception';

export class ContactMeansNameEqualException extends DomainException {

  static readonly code: number = 509;

  constructor() {
    super('O nome esta vinculado a outro meio de contato.');
  }
}