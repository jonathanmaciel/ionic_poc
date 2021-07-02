import { Injectable } from '@angular/core';
import { Contact } from 'src/app/domain/entities/contact';
import { ContactMeans } from 'src/app/domain/entities/contact-means';
import { Setting } from 'src/app/domain/entities/setting';
import { ContactMeansMainRemovedException } from 'src/app/domain/exceptions/contact-means-main-removed-exception';
import { ContactMeansNameEqualException } from 'src/app/domain/exceptions/contact-means-name-equal-exception';
import { ContactMeansSingleRemovedException } from 'src/app/domain/exceptions/contact-means-single-removed-exception';
import { ContactNameEqualException } from 'src/app/domain/exceptions/contact-name-equal-exception';
import { Contacts } from 'src/app/domain/repositories/contacts';
import { Means } from 'src/app/domain/repositories/means';
import { Settings } from 'src/app/domain/repositories/settings';
import { ContactBook } from 'src/app/domain/services/contact-book';

@Injectable({
  providedIn: 'root'
})
export class ContactBookLocal implements ContactBook {

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
    return (contact.id == 0) ? this._post(Contact.copy(contact)) 
                             : this._put(Contact.copy(contact));
  };

  private async _post(contact: Contact): Promise<Contact> {
    const contactsListed: Contact[] = await this.contacts.listNames(contact.name);
    const hasContactsInsertedWithSameName: boolean = contactsListed && contactsListed.length > 0;
    if (hasContactsInsertedWithSameName) throw new ContactNameEqualException();
    return this.contacts.post(contact);
  }

  private async _put(contact: Contact): Promise<Contact> {
    const contactsListed: Contact[] = await this.contacts.listNames(contact.name);
    const hasContactsInsertedWithSameName: boolean = contactsListed.find((currentItemListed) => currentItemListed.id != contact.id) != null;
    if (hasContactsInsertedWithSameName)  throw new ContactNameEqualException();
    return this.contacts.put(contact);
  }

  async remove(contact: Contact): Promise<boolean> { 
    return this.contacts.delete(Contact.copy(contact));
  }

  async removeContactMeans(contactMeans: ContactMeans): Promise<boolean> {
    const contact: Contact = await this.contacts.item(contactMeans.contact.id);
    const hasMoreThanOneContactMeansAndThisIsMain: boolean = contact.means.length > 1 && contactMeans.isMain;
    if (hasMoreThanOneContactMeansAndThisIsMain ) throw new ContactMeansMainRemovedException();
    if (contact.isSingleContactMeans) throw new ContactMeansSingleRemovedException();
    return this.means.delete(ContactMeans.copy(contactMeans));
  }

  async addContactMeans(contactMeans: ContactMeans): Promise<ContactMeans> {
    return contactMeans.id == 0 ? this._postContactMeans(ContactMeans.copy(contactMeans)) 
                                : this._putContactMeans(ContactMeans.copy(contactMeans));
  }

  private async _postContactMeans(contactMeans: ContactMeans): Promise<ContactMeans> {
    const meansListed: ContactMeans[] = await this.means.listNames(contactMeans);
    const hasMeansInsertedWithSameName: boolean = meansListed && meansListed.length > 0;
    if (hasMeansInsertedWithSameName) throw new ContactMeansNameEqualException();
    return this.means.post(contactMeans);
  }

  private async _putContactMeans(contactMeans: ContactMeans): Promise<ContactMeans> {
    const meansListed: ContactMeans[] = await this.means.listNames(contactMeans);
    const hasMeansInsertedWithSameName: boolean = meansListed.find((currentItemListed) => currentItemListed.id != contactMeans.id) != null;
    if (hasMeansInsertedWithSameName) throw new ContactMeansNameEqualException();
    return this.means.put(contactMeans);
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
