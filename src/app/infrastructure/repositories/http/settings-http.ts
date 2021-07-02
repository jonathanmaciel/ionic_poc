import { Injectable } from '@angular/core';
import { Setting } from 'src/app/domain/entities/setting';
import { Settings } from 'src/app/domain/repositories/settings';
import { Http } from './http';

@Injectable({
  providedIn: 'root'
})
export class SettingsHttp extends Http implements Settings {

  public async item(id: number): Promise<Setting> {
    const URL: string = await this.hostURL() + '/contacts/book/settings/' + id;
    return await this.httpClient.get<Setting>(URL, this.defaultOptions).toPromise();
  }

  public async put(setting: Setting): Promise<Setting> {
    const URL: string = await this.hostURL() + '/contacts/book/settings/';
    return await this.httpClient.put<Setting>(URL, JSON.stringify(setting), this.defaultOptions).toPromise();
  }
}
