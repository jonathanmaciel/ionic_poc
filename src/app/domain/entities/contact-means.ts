import { Contact } from "./contact";

export class ContactMeans {

  id: number;
  
  name: string;
  
  value: string;
  
  isMain: boolean;
  
  contact: Contact;

  constructor(id: number, name: string, value: string, isMain:boolean, contact:Contact) {
    this.id = id;
    this.name = name;
    this.value = value;
    this.isMain = isMain;
    this.contact = contact;
  }

  static copy(instance: any): ContactMeans {
    const contactMeansCopied: ContactMeans = new ContactMeans(instance.id, instance.name, instance.value, instance.isMain, null);
    if (instance.contact) contactMeansCopied.contact = new Contact(instance.contact.id, instance.contact.name, instance.contact.description);
    return contactMeansCopied;
  }

  static newInstance(contact: Contact = null): ContactMeans {
    return new ContactMeans(0, '', '', false, new Contact(contact.id, contact.name, contact.description));
  }
}
