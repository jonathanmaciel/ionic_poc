import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Setting } from 'src/app/domain/entities/setting';
import { Settings } from 'src/app/domain/repositories/settings';
import { ConnectionSQLite } from './connection';

@Injectable({
  providedIn: 'root'
})
export class SettingsDaoSQLiteService implements Settings {

  constructor(private _connection: ConnectionSQLite) { }

  public async item(id: number): Promise<Setting> {
    const database: SQLiteObject = await this._connection.connect();
    const meansMapped = await database.executeSql(_SettingsSqliteSQL.select, [id]);
    const item: any = meansMapped.rows.item(0);
    const test: Setting = new Setting(item.settings_id, item.settings_value);
    return test;
  }

  public async put(setting: Setting): Promise<Setting> {
    const database: SQLiteObject = await this._connection.connect();
    const meansMapped = await database.executeSql(_SettingsSqliteSQL.update, [setting.value, setting.id]);
    // if (rowsEffected == 0) throw Exception('ERROR: Settings SQL UPDATE');
    return new Setting(setting.id, setting.value);
  }
}


class _SettingsSqliteSQL {

  static readonly select: string =
      'SELECT settings_id, settings_value ' +
      'FROM tb_settings ' +
      'WHERE settings_id = ? ' +
      'ORDER BY settings_id ';

  static readonly update: string =
      'UPDATE tb_settings SET settings_value=? ' +
      'WHERE settings_id=? ';
}