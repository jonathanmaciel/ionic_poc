import { Injectable } from '@angular/core';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { Contact } from 'src/app/domain/entities/contact';
import { Contacts } from 'src/app/domain/repositories/contacts';
import { Preferences } from '../../preferences';
import { HttpNative } from './http-native';

@Injectable({
  providedIn: 'root'
})
export class ContactsHttpNative extends HttpNative implements Contacts {

  constructor(private httpNative: HTTP, private preferences: Preferences) { 
    super();
    this.httpNative.setDataSerializer("json");
  }

  public async list(): Promise<Contact[]> {   
    const response: HTTPResponse = await this.httpNative.get(await this.preferences.getHttpHostURL() + '/contacts/book', null, this.defaultOptions);
    const isNotListed: boolean = response.status != 200;
    if (isNotListed) throw Error('ERROR: Contacts HTTP GET - ' + response.status);
    const dataJSON: [] = JSON.parse(response.data);
    const contactListed: Contact[] = [];
    for (let i: number = 0; i < dataJSON.length; i++) contactListed.push(Contact.copy(dataJSON[i], true));
    return contactListed;
  }

  async item(id: number): Promise<Contact> {
    const response: HTTPResponse = await this.httpNative.get(await this.preferences.getHttpHostURL() + '/contacts/book/' + id, null, this.defaultOptions);
    const isNotListed: boolean = response.status != 200;
    if (isNotListed) throw Error('ERROR: Contacts HTTP GET - ' + response.status);
    return Contact.copy(JSON.parse(response.data), true);
  }

  async listNames(name: string): Promise<Contact[]> {
    throw Error('no http impl.');
  }

  public async post(contact: Contact): Promise<Contact> {
    try {
      const response: HTTPResponse = await this.httpNative.post(await this.preferences.getHttpHostURL() + '/contacts/book', contact, this.defaultOptions);
      const isNotCreated: boolean = response.status != 201;
      if (isNotCreated) throw Error('ERROR: Contacts HTTP POST - ' + response.status);
      return Contact.copy(JSON.parse(response.data), true);
    } catch (e) {
      this.handlerException(e);
    }
  }

  public async put(contact: Contact): Promise<Contact> {
    try {
      const response: HTTPResponse = await this.httpNative.put(await this.preferences.getHttpHostURL() + '/contacts/book', contact, this.defaultOptions);
      const isNotUpdated: boolean = response.status != 200;
      if (isNotUpdated) throw Error('ERROR: Contacts HTTP PUT - ' + response.status);
      return Contact.copy(JSON.parse(response.data), true);
    } catch (e) {
      this.handlerException(e);
    }
  }

  public async delete(contact: Contact): Promise<boolean> {
    const URL: string = await this.preferences.getHttpHostURL();
    try {
      const response: HTTPResponse = await this.httpNative.delete(URL + '/contacts/book/' + contact.id, null, this.defaultOptions);
      const isNotRemoved: boolean = response.status != 200;
      if (isNotRemoved) throw Error('ERROR: Contacts HTTP DELETE - ' + response.status);
      return true;
    } catch (e) {
      this.handlerException(e);
    }
  }
}
