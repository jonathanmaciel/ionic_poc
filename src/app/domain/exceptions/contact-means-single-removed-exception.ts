import { DomainException } from 'src/app/domain/exceptions/domain-exception';

export class ContactMeansSingleRemovedException extends DomainException {

  static readonly code: number = 507;

  constructor() {
    super('Voce esta tentando remover o ultimo meio ' +
        'de contato para este contato, deseja excluir esse contato?');
  }
}