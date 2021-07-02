import { Injectable } from '@angular/core';
import { Contact } from 'src/app/domain/entities/contact';
import { ContactMeans } from 'src/app/domain/entities/contact-means';
import { Setting } from 'src/app/domain/entities/setting';
import { Contacts } from 'src/app/domain/repositories/contacts';
import { Means } from 'src/app/domain/repositories/means';
import { Settings } from 'src/app/domain/repositories/settings';
import { ContactBook } from 'src/app/domain/services/contact-book';

@Injectable({
  providedIn: 'root'
})
export class ContactBookRemote implements ContactBook {

  constructor(/*@Inject('contacts')*/ private contacts: Contacts,
      /*@Inject('means')*/ private means: Means,
      /*@Inject('settings')*/ private settings: Settings) { }

  async list(): Promise<Contact[]> {
    return this.contacts.list();
  }

  async item(id: number): Promise<Contact> {
    return this.contacts.item(id);
  }

  async add(contact: Contact): Promise<Contact> {
    return (contact.id == 0) ? this.contacts.post(Contact.copy(contact)) 
                             : this.contacts.put(Contact.copy(contact));
  };

  async remove(contact: Contact): Promise<boolean> { 
    return this.contacts.delete(Contact.copy(contact));
  }

  async removeContactMeans(contactMeans: ContactMeans): Promise<boolean> {
    return this.means.delete(ContactMeans.copy(contactMeans));
  }

  async addContactMeans(contactMeans: ContactMeans): Promise<ContactMeans> {
    return contactMeans?.id == 0 ? this.means.post(ContactMeans.copy(contactMeans)) 
                                 : this.means.put(ContactMeans.copy(contactMeans));
  }

  async getInstructionFisrtContactAddStatus(): Promise<boolean> {
    return (await this.settings.item(1)).value == '1';
  }

  async setInstructionFisrtContactAddStatus(value: boolean): Promise<void> {
    const setting: Setting = await this.settings.item(1);
    setting.value = value ? '1' : '0';
    await this.settings.put(setting);
  }

  async getInstructionFisrtContactMeansAddStatus(): Promise<boolean> {
    return (await this.settings.item(2)).value == '1';
  }

  async setInstructionFisrtContactMeansAddStatus(value: boolean): Promise<void> {
    const setting: Setting = await this.settings.item(2);
    setting.value = value ? '1' : '0';
    await this.settings.put(setting);
  }
}
