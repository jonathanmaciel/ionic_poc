import { Contact } from 'src/app/domain/entities/contact';
import { ContactMeans } from 'src/app/domain/entities/contact-means';

export interface Means {

  list(contact: Contact): Promise<ContactMeans[]>;

  listNames(contactMeans: ContactMeans): Promise<ContactMeans[]>;

  post(contactMeans: ContactMeans): Promise<ContactMeans>;

  put(contactMeans: ContactMeans): Promise<ContactMeans>;

  delete(contactMeans: ContactMeans): Promise<boolean>;
}
