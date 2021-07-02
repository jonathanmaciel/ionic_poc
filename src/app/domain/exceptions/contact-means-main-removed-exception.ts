import { DomainException } from 'src/app/domain/exceptions/domain-exception';

export class ContactMeansMainRemovedException extends DomainException {

  static readonly code: number = 506;

  constructor() {
    super('Voce esta tentando remover o meio de ' +
        'contato principal para este contato, selecione outro e tente novamente.');
  }
}