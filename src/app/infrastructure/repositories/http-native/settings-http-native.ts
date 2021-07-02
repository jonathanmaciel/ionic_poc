import { Injectable } from '@angular/core';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { Setting } from 'src/app/domain/entities/setting';
import { Settings } from 'src/app/domain/repositories/settings';
import { Preferences } from '../../preferences';
import { HttpNative } from './http-native';

@Injectable({
  providedIn: 'root'
})
export class SettingsHttpNative extends HttpNative implements Settings {

  constructor(private httpNative: HTTP, private preferences: Preferences) { 
    super();
    this.httpNative.setDataSerializer("json");
  }

  public async item(id: number): Promise<Setting> {
    const response: HTTPResponse = await this.httpNative.get(await this.preferences.getHttpHostURL() + '/contacts/book/settings/' + id, null, this.defaultOptions);
    const isNotListed: boolean = response.status != 200;
    if (isNotListed) throw Error('ERROR: Settings HTTP GET - ' + response.status);
    const dataJSON:any = JSON.parse(response.data);
    return new Setting(dataJSON.id, dataJSON.value);
  }

  public async put(setting: Setting): Promise<Setting> {
    const response: HTTPResponse = await this.httpNative.put(await this.preferences.getHttpHostURL() + '/contacts/book/settings', setting, this.defaultOptions);
    const isNotUpdated: boolean = response.status != 200;
    if (isNotUpdated) throw Error('ERROR: Settings HTTP PUT - ' + response.status);
    const dataJSON:any = JSON.parse(response.data);
    return new Setting(dataJSON.id, dataJSON.value);
  }
}
