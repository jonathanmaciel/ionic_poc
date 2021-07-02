import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Contact } from 'src/app/domain/entities/contact';
import { ContactMeans } from 'src/app/domain/entities/contact-means';
import { Means } from 'src/app/domain/repositories/means';
import { ConnectionSQLite } from './connection';

@Injectable({
  providedIn: 'root'
})
export class ContactMeansDaoSQLiteService implements Means {

  constructor(private _connection:ConnectionSQLite) { }

  public async list(contact: Contact): Promise<ContactMeans[]> {    
    const database: SQLiteObject = await this._connection.connect();
    const meansMapped = await database.executeSql(_MeansSqliteSQL.select, [contact.id]);
    const meansList: ContactMeans[] = [];
    for (let i:number = 0; i < meansMapped.rows.length; i++) {
      const item: any = meansMapped.rows.item(i);
      meansList.push(new ContactMeans(item.contact_means_id, item.contact_means_name, 
          item.contact_means_value, item.contact_means_is_main == 1, contact));
    }
    return meansList;
  }

  public async listNames(contactMeans: ContactMeans): Promise<ContactMeans[]> {
    const database: SQLiteObject = await this._connection.connect();
    const meansMapped = await database.executeSql(_MeansSqliteSQL.selectName, 
        [contactMeans.contact.id, contactMeans.name, contactMeans.value]);
    const meansListed: ContactMeans[] = [];
    for (let i:number = 0; i < meansMapped.rows.length; i++) {
      const item: any = meansMapped.rows.item(i);
      meansListed.push(new ContactMeans(item.contact_means_id, item.contact_means_name, 
          item.contact_means_value, item.contact_means_is_main == 1, null /* TODO */));
    }
    return meansListed;
  }

  public async post(contactMeans: ContactMeans): Promise<ContactMeans> {
    const database: SQLiteObject = await this._connection.connect();
    if (contactMeans.isMain) {
      await database.executeSql(_MeansSqliteSQL.updateMainContact, [false, contactMeans.contact.id]);
    }
    const meansMapped = await database.executeSql(_MeansSqliteSQL.insert, [contactMeans.contact.id, 
        contactMeans.name, contactMeans.value, contactMeans.isMain ? 1 : 0]);
    contactMeans.id = meansMapped.insertId;
    return contactMeans;
  }

  public async put(contactMeans: ContactMeans): Promise<ContactMeans> {
    const database: SQLiteObject = await this._connection.connect();
    if (contactMeans.isMain) {
      await database.executeSql(_MeansSqliteSQL.updateMainContact, [false, contactMeans.contact.id]);
    }
    await database.executeSql(_MeansSqliteSQL.update, [contactMeans.name, 
        contactMeans.value, contactMeans.isMain ? 1 : 0, contactMeans.id]);
    return contactMeans;
  }

  public async delete(contactMeans: ContactMeans): Promise<boolean> {
    const database: SQLiteObject = await this._connection.connect();
    const contactsMapped: any = await database.executeSql(_MeansSqliteSQL.delete, [contactMeans.id]);
    return contactsMapped.rowsAffected > 0;
  }
}

class _MeansSqliteSQL {

  static readonly select: string = 
      'select contact_means_id, contact_means_name, contact_means_value, ' +
      '    contact_means_is_main ' +
      'from tb_contact_means ' +
      'where contacts_id = ? ' +
      'order by contact_means_id;';

  static readonly selectName: string = 
      'select contact_means_id, contact_means_name, contact_means_value, ' +
      '    contact_means_is_main ' +
      'from tb_contact_means ' +
      'where contacts_id = ? AND contact_means_name = ? AND contact_means_value =?;';

  static readonly insert: string = 
      'insert into tb_contact_means(contacts_id, contact_means_name, ' +
      '    contact_means_value, ' +
      'contact_means_is_main) values(?, ?, ?, ?)';

  static readonly update: string = 
      'update tb_contact_means set contact_means_name=?, contact_means_value=?, ' +
      '    contact_means_is_main=? ' +
      'where contact_means_id=?';

  static readonly updateMainContact =
      'update tb_contact_means set contact_means_is_main=? ' +
      'where contacts_id=?';

  static readonly delete =
      'delete from tb_contact_means ' +
      'where contact_means_id=?';
}