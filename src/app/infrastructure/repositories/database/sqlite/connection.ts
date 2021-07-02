import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class ConnectionSQLite {

  private _connection: SQLiteObject;

  constructor(private sqlite: SQLite) { }

  public async connect(): Promise<SQLiteObject> {
    if (!this._connection) {
      this._connection = await this.sqlite.create({name: 'ionic_poc.db', location: 'default' /* TODO version */});
      await this._connection.executeSql(DatabaseServiceSQL.createContacts, []);
      await this._connection.executeSql(DatabaseServiceSQL.createContactMeans, []);
      await this._connection.executeSql(DatabaseServiceSQL.createSettings, []);
      await this._connection.executeSql(DatabaseServiceSQL.insertDefaultSettings1, []);
      await this._connection.executeSql(DatabaseServiceSQL.insertDefaultSettings2, []);
    }
    return this._connection;
  }
}

class DatabaseServiceSQL {

  static readonly createContacts: string =
    'CREATE TABLE IF NOT EXISTS tb_contacts ( ' +
    '  contacts_id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
    '  contacts_name VARCHAR(250), ' +
    '  contacts_description VARCHAR(250) ' +
    '); ';

  static readonly createContactMeans: string =
    'CREATE TABLE IF NOT EXISTS tb_contact_means( ' +
    '  contacts_id INTEGER, ' +
    '  contact_means_id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
    '  contact_means_name VARCHAR(250), ' +
    '  contact_means_value VARCHAR(250), ' +
    '  contact_means_description VARCHAR(250), ' +
    '  contact_means_is_main NUMBER, ' +
    '  FOREIGN KEY(contacts_id) REFERENCES TB_CONTACT(CONTACTS_ID) ' +
    ');';

  static readonly createSettings: string =
    'CREATE TABLE IF NOT EXISTS TB_SETTINGS( ' +
    '  settings_id integer PRIMARY KEY AUTOINCREMENT, ' +
    '  settings_value VARCHAR(100) ' +
    ');'
  ;

  static readonly insertDefaultSettings1: string = 'INSERT OR IGNORE INTO tb_settings (settings_id, settings_value) VALUES (1, 1);';

  static readonly insertDefaultSettings2: string = 'INSERT OR IGNORE INTO tb_settings (settings_id, settings_value) VALUES (2, 1);';
}
