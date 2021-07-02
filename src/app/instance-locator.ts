import { Injectable, Injector } from "@angular/core";
import { ContactBook } from "./domain/services/contact-book";
import { Preferences } from "./infrastructure/preferences";
import { ContactBookLocal } from "./infrastructure/services/contact-book-local";
import { ContactBookRemote } from "./infrastructure/services/contact-book-remote";

@Injectable({
  providedIn: 'root'
})
export class InstanceLocator {

  private _contactBookLocal: ContactBookLocal;
  private _contactBookRemoteHttp: ContactBookRemote;
  private _contactBookRemoteHttpNative: ContactBookRemote;

  constructor(private injector: Injector, private preferences: Preferences) { }

  async contactBook(): Promise<ContactBook> {
    const currentEnvironmentId: string = await this.preferences.getEnvironment();
    if (currentEnvironmentId == Preferences.environmentRemoteHttpId) return this.contactBookRemoteHttp;
    else if (currentEnvironmentId == Preferences.environmentRemoteNativeHttpId) return this.contactBookRemoteHttpNative;
    else return this.contactBookLocal;
  }

  private get contactBookLocal(): ContactBookLocal {
    if (!this._contactBookLocal) {
      this._contactBookLocal = new ContactBookLocal(this.injector.get('contactsLocal'), 
          this.injector.get('meansLocal'), this.injector.get('settingsLocal'))
    }
    return this._contactBookLocal;
  }

  private get contactBookRemoteHttp(): ContactBookRemote {
    if (!this._contactBookRemoteHttp) {
      this._contactBookRemoteHttp = new ContactBookRemote(this.injector.get('contactsHttp'), 
          this.injector.get('meansHttp'), this.injector.get('settingsHttp'));
    }
    return this._contactBookRemoteHttp;
  }

  private get contactBookRemoteHttpNative(): ContactBookRemote {
    if (!this._contactBookRemoteHttpNative) {
      this._contactBookRemoteHttpNative = new ContactBookRemote(this.injector.get('contactsNativeHttp'), 
          this.injector.get('meansHttpNative'), this.injector.get('settingsHttpNative'));
    }
    return this._contactBookRemoteHttpNative;
  }
}