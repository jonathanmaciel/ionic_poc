import { ContactMeans } from "./contact-means";

export class Contact {

  id: number;
  
  name: string;
    
  description: string;
    
  label: string;

  means: ContactMeans[];

  constructor(id: number, name: string, description: string, label: string = '') {
    this.id = id;
    this.name = name;
    this.description = description;
    this.label = label;
  }

  get isSingleContactMeans(): boolean { 
    return this.means.length == 1;
  }

  static copy(instance: any, fullReference: boolean = false): Contact {
    const contactCopied: Contact = new Contact(instance.id, instance.name, instance.description, instance.label);
    if (!instance.means || instance.means.length == 0) return;
    contactCopied.means = [];
    for (let i: number = 0;  i < instance.means.length; i++) {
      const contactMeans: ContactMeans = ContactMeans.copy(instance.means[i]);
      if (fullReference) contactMeans.contact = contactCopied;
      contactCopied.means.push(contactMeans);
    }
    return contactCopied;
  }

  static newInstance(): Contact {
    const contact: Contact = new Contact(0, '', '');
    contact.means = [new ContactMeans(0, '', '', true, contact)];
    return contact;
  }
}
