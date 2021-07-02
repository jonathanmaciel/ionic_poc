import { Contact } from 'src/app/domain/entities/contact';
import { ContactMeans } from 'src/app/domain/entities/contact-means';

export interface ContactBook {

  list(): Promise<Contact[]>;

  item(id: number): Promise<Contact>;

  add(contact: Contact): Promise<Contact>;

  remove(contact: Contact): Promise<boolean>;

  removeContactMeans(contactMeans: ContactMeans): Promise<boolean>;

  addContactMeans(contactMeans: ContactMeans): Promise<ContactMeans>;

  getInstructionFisrtContactAddStatus(): Promise<boolean>;

  setInstructionFisrtContactAddStatus(value: boolean): Promise<void>;

  getInstructionFisrtContactMeansAddStatus(): Promise<boolean>;

  setInstructionFisrtContactMeansAddStatus(value: boolean): Promise<void>;
}
