import { Injectable } from '@angular/core';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { Contact } from 'src/app/domain/entities/contact';
import { ContactMeans } from 'src/app/domain/entities/contact-means';
import { Means } from 'src/app/domain/repositories/means';
import { Preferences } from '../../preferences';
import { HttpNative } from './http-native';

@Injectable({
  providedIn: 'root'
})
export class MeansHttpNative extends HttpNative implements Means {

  constructor(private httpNative: HTTP, private preferences: Preferences) { 
    super();
    this.httpNative.setDataSerializer("json");
  }

  public async list(contact: Contact): Promise<ContactMeans[]> {
    const response: HTTPResponse = await this.httpNative.get(await this.preferences.getHttpHostURL() + '/contacts/book/means/' + contact.id, null, this.defaultOptions);
    const isNotListed: boolean = response.status != 200;
    if (isNotListed) throw Error('ERROR: Contacts HTTP GET - ' + response.status);
    const dataJSON: [] = JSON.parse(response.data);
    return dataJSON.map((itemJSON: any) => new ContactMeans(itemJSON.id, itemJSON.name, itemJSON.value, itemJSON.isMain, contact));
  }

  public async listNames(contactMeans: ContactMeans): Promise<ContactMeans[]> {
    throw Error('no http impl.');
  }

  public async post(contactMeans: ContactMeans): Promise<ContactMeans> {
    try {
      const response: HTTPResponse = await this.httpNative.post(await this.preferences.getHttpHostURL() + '/contacts/book/means', contactMeans, this.defaultOptions);
      const isNotCreated: boolean = response.status != 201;
      if (isNotCreated) throw Error('ERROR: Contact Means HTTP POST - ' + response.status);
      const dataJSON:any = JSON.parse(response.data);
      return new ContactMeans(dataJSON.id, dataJSON.name, dataJSON.value, dataJSON.isMain, contactMeans.contact);
    } catch (e) {
      this.handlerException(e);
    }
  }

  public async put(contactMeans: ContactMeans): Promise<ContactMeans> {
    try {
      const response: HTTPResponse = await this.httpNative.put(await this.preferences.getHttpHostURL() + '/contacts/book/means/', contactMeans, this.defaultOptions);
      const isNotUpdated: boolean = response.status != 200;
      if (isNotUpdated) throw Error('ERROR: Contact Means HTTP PUT - ' + response.status);
      const dataJSON:any = JSON.parse(response.data);
      return new ContactMeans(dataJSON.id, dataJSON.name, dataJSON.value, dataJSON.isMain, contactMeans.contact);
    } catch (e) {
      this.handlerException(e);
    }
  }

  public async delete(contactMeans: ContactMeans): Promise<boolean> {
    const URL: string = await this.preferences.getHttpHostURL();
    try {
      const response: HTTPResponse = await this.httpNative.delete(URL + '/contacts/book/means/' + contactMeans.id, null, this.defaultOptions);
      const isNotRemoved: boolean = response.status != 200;
      if (isNotRemoved) throw Error('ERROR: Contact Means HTTP DELETE - ' + response.status);
      return true;
    } catch (e) {
      this.handlerException(e);
    }
  }
}
