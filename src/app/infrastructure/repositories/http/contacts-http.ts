import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contact } from 'src/app/domain/entities/contact';
import { Contacts } from 'src/app/domain/repositories/contacts';
import { Http } from './http';

@Injectable({
  providedIn: 'root'
})
export class ContactsHttp extends Http implements Contacts {

  public async list(): Promise<Contact[]> {
    const URL: string = await this.hostURL() + '/contacts/book';
    return this.httpClient.get<Contact[]>(URL, this.defaultOptions).toPromise();
  }

  async item(id: number): Promise<Contact> {
    const URL: string = await this.hostURL() + '/contacts/book/' + id;
    return this.httpClient.get<Contact>(URL, this.defaultOptions).toPromise();
  }

  async listNames(name: string): Promise<Contact[]> {
    throw Error('no http impl.');
  }

  public async post(contact: Contact): Promise<Contact> {
    const URL: string = await this.hostURL() + '/contacts/book';
    try {
      return await this.httpClient.post<Contact>(URL, JSON.stringify(contact), this.defaultOptions).toPromise();
    } catch (e) {
      this.handlerException(e);
    }
  }

  public async put(contact: Contact): Promise<Contact> {
    const URL: string = await this.hostURL() + '/contacts/book';
    try {
      return await this.httpClient.put<Contact>(URL, JSON.stringify(contact), this.defaultOptions).toPromise();
    } catch (e) {
      this.handlerException(e);
    }
  }

  public async delete(contact: Contact): Promise<boolean> {
    const URL: string = await this.hostURL() + '/contacts/book';
    const options = {
      headers: new HttpHeaders({
        'Content-type': 'application/json', 
        'Accept': 'application/json'
      }),
      body: JSON.stringify(contact)
    };
    try {
      await this.httpClient.delete(URL, options).toPromise();
      return true;
    } catch (e) {
      this.handlerException(e);
    }
  }
}
