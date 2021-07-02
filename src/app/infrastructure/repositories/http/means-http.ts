import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contact } from 'src/app/domain/entities/contact';
import { ContactMeans } from 'src/app/domain/entities/contact-means';
import { Means } from 'src/app/domain/repositories/means';
import { Http } from './http';

@Injectable({
  providedIn: 'root'
})
export class MeansHttp extends Http implements Means {

  public async list(contact: Contact): Promise<ContactMeans[]> {
    const URL: string = await this.hostURL() + '/contacts/book/means/' + contact.id;
    return this.httpClient.get<ContactMeans[]>(URL, this.defaultOptions).toPromise();
  }

  public async listNames(contactMeans: ContactMeans): Promise<ContactMeans[]> {
    throw Error('no http impl.');
  }

  public async post(contactMeans: ContactMeans): Promise<ContactMeans> {
    const URL: string = await this.hostURL() + '/contacts/book/means/';
    try {
      const c = await this.httpClient.post<ContactMeans>(URL, JSON.stringify(contactMeans), this.defaultOptions).toPromise();
      return c;
    } catch (e) {
      this.handlerException(e);
    }
  }

  public async put(contactMeans: ContactMeans): Promise<ContactMeans> {
    const URL: string = await this.hostURL() + '/contacts/book/means/';
    try {
      return await this.httpClient.put<ContactMeans>(URL, JSON.stringify(contactMeans), this.defaultOptions).toPromise();
    } catch (e) {
      this.handlerException(e);
    }
  }

  public async delete(contactMeans: ContactMeans): Promise<boolean> {
    const URL: string = await this.hostURL() + '/contacts/book/means/' + contactMeans.id;
    const options = {
      headers: new HttpHeaders({
        'Content-type': 'application/json', 
        'Accept': 'application/json'
      }),
      body: JSON.stringify(contactMeans)
    };
    try {
      await this.httpClient.delete(URL, options).toPromise();
      return true;
    } catch (e) {
      this.handlerException(e);
    }
  }
}
