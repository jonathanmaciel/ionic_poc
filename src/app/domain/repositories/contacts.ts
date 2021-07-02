import { Contact } from 'src/app/domain/entities/contact';

export interface Contacts {

  list(): Promise<Contact[]>;

  item(id: number): Promise<Contact>;

  listNames(name: string): Promise<Contact[]>;

  post(contact: Contact): Promise<Contact>;

  put(contact: Contact): Promise<Contact>;

  delete(contact: Contact): Promise<boolean>;
}
