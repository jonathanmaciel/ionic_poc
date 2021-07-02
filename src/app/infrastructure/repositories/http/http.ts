import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ContactMeansMainRemovedException } from 'src/app/domain/exceptions/contact-means-main-removed-exception';
import { ContactMeansNameEqualException } from 'src/app/domain/exceptions/contact-means-name-equal-exception';
import { ContactMeansSingleRemovedException } from 'src/app/domain/exceptions/contact-means-single-removed-exception';
import { ContactNameEqualException } from 'src/app/domain/exceptions/contact-name-equal-exception';
import { Preferences } from 'src/app/infrastructure/preferences';

@Injectable({
  providedIn: 'root'
})
export class Http {

  constructor(protected httpClient: HttpClient, protected preferences: Preferences) { }

  protected defaultOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/json', 
      'Accept': 'application/json'
    })
  };

  async hostURL(): Promise<string> {
    return this.preferences.getHttpHostURL();
  }

  handlerException(e) {
    if (e instanceof HttpErrorResponse) {
      if (e.error && e.error.type && e.error.type == 'domain') {
        const status: number = e.error.status;
        switch (status) {
          case ContactMeansMainRemovedException.code: throw new ContactMeansMainRemovedException();
          case ContactMeansSingleRemovedException.code: throw new ContactMeansSingleRemovedException();
          case ContactNameEqualException.code: throw new ContactNameEqualException();
          case ContactMeansNameEqualException.code: throw new ContactMeansNameEqualException();
          default: throw Error('undefined');
        }
      } else {
        throw e;
      }
      throw Error(e.message)
    }
  }
}
