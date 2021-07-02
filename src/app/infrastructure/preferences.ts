import { Injectable } from "@angular/core";
import { AppPreferences } from "@ionic-native/app-preferences/ngx";

@Injectable({
  providedIn: 'root'
})
export class Preferences {

  static readonly remoteHttpUrlKey: string = 'Infrastructure.Preference.REMOTE_HTTP_URL';

  static readonly remoteHttpUrlLocalhost: string = '';

  static readonly environmentKey: string = 'Infrastructure.Preference.ENVIRONMENT';

  static readonly environmentLocalId: string = '1';

  static readonly environmentRemoteHttpId: string = '2';

  static readonly environmentRemoteNativeHttpId: string = '3';

  constructor(private appPreferences: AppPreferences) { }

  async getHttpHostURL(): Promise<string> {
    const value: string = await this.appPreferences.fetch(Preferences.remoteHttpUrlKey);
    return (!value || value.trim().length) ? value : Preferences.remoteHttpUrlLocalhost;
  }

  async setHttpHostURL(value: string): Promise<void> {
    this.appPreferences.store(Preferences.remoteHttpUrlKey, value);
  }

  async getEnvironment(): Promise<string> {
    const value: string = await this.appPreferences.fetch(Preferences.environmentKey);
    return value ? value :  Preferences.environmentLocalId;
  }

  async setEnvironment(value: string): Promise<void> {
    this.appPreferences.store(Preferences.environmentKey, value);
  }

  async isEnvironmentLocal(): Promise<boolean> {
    const currentEnvironment: string = await this.getEnvironment();
    return currentEnvironment == Preferences.environmentLocalId;
  }

  async isEnvironmentHttpApi(): Promise<boolean> {
    const currentEnvironment: string = await this.getEnvironment();
    return currentEnvironment == Preferences.environmentRemoteHttpId;
  }

  async isEnvironmentNativeHttpApi(): Promise<boolean> {
    const currentEnvironment: string = await this.getEnvironment();
    return currentEnvironment == Preferences.environmentRemoteNativeHttpId;
  }

  async currentEnvironment(): Promise<string> {
    const currentEnvironment = await this.getEnvironment();
    switch (currentEnvironment) {
      case Preferences.environmentRemoteHttpId : return 'REMOTE_HTTP';
      case Preferences.environmentRemoteNativeHttpId : return 'REMOTE_NATIVE_HTTP';
      default: return 'LOCAL';
    }
  }
}
