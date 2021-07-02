import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { AppPreferences } from '@ionic-native/app-preferences/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Preferences } from './infrastructure/preferences';
import { ConnectionSQLite } from './infrastructure/repositories/database/sqlite/connection';
import { ContactDaoSQLiteService } from './infrastructure/repositories/database/sqlite/contacts-dao-sqlite';
import { ContactMeansDaoSQLiteService } from './infrastructure/repositories/database/sqlite/means-dao-sqlite';
import { SettingsDaoSQLiteService } from './infrastructure/repositories/database/sqlite/settings-dao-sqlite';
import { ContactsHttpNative } from './infrastructure/repositories/http-native/contacts-http-native';
import { MeansHttpNative } from './infrastructure/repositories/http-native/means-http-native';
import { SettingsHttpNative } from './infrastructure/repositories/http-native/settings-http-native';
import { ContactsHttp } from './infrastructure/repositories/http/contacts-http';
import { MeansHttp } from './infrastructure/repositories/http/means-http';
import { SettingsHttp } from './infrastructure/repositories/http/settings-http';
import { ContactBookLocal } from './infrastructure/services/contact-book-local';
import { ContactBookRemote } from './infrastructure/services/contact-book-remote';
import { InstanceLocator } from './instance-locator';
import { Commons } from './presentations/commons';
import { InstructionsModal } from './presentations/instructions/instructions.modal';
import { PreferencesModal } from './presentations/preferences/preferences.modal';


@NgModule({
  declarations: [AppComponent, InstructionsModal, PreferencesModal],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    FormsModule, 
    ReactiveFormsModule, 
    CommonModule,
    HttpClientModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, 
    SQLite, 
    ConnectionSQLite,
    AppPreferences,
    HTTP,
    { provide: 'contactsLocal', useClass: ContactDaoSQLiteService }, 
    { provide: 'contactsHttp', useClass: ContactsHttp }, 
    { provide: 'contactsNativeHttp', useClass: ContactsHttpNative }, 
    { provide: 'meansLocal', useClass: ContactMeansDaoSQLiteService }, 
    { provide: 'meansHttp', useClass: MeansHttp }, 
    { provide: 'meansHttpNative', useClass: MeansHttpNative }, 
    { provide: 'settingsLocal', useClass: SettingsDaoSQLiteService }, 
    { provide: 'settingsHttp', useClass: SettingsHttp }, 
    { provide: 'settingsHttpNative', useClass: SettingsHttpNative }, 
    { provide: 'contactBookLocal', useClass: ContactBookLocal }, 
    { provide: 'contactBookHttp', useClass: ContactBookRemote }, 
    
    // { provide: 'contactBook', useFactory: providerFactory('contactBook'), deps: [Injector] },
    // { provide: 'contacts', useFactory: providerFactory('contacts'), deps: [Injector] },
    // { provide: 'means', useFactory: providerFactory('means'), deps: [Injector] },
    // { provide: 'settings', useFactory: providerFactory('settings'), deps: [Injector] }

    InstanceLocator,
    Commons,
    Preferences
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

// export function providerFactory(T: string) {
//   return (injector: Injector) => {
//     if (environment.service == serviceEnvironment.local) {
//       return injector.get(T + 'Local');
//     } else {
//       return injector.get(T + 'Http');
//     }
//   };
// };