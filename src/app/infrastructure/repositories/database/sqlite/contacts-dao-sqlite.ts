import { Injectable } from '@angular/core';
import { ConnectionSQLite } from './connection';
import { SQLiteObject } from '@ionic-native/sqlite/ngx';
import { ContactMeansDaoSQLiteService } from './means-dao-sqlite';
import { Contact } from 'src/app/domain/entities/contact';
import { ContactMeans } from 'src/app/domain/entities/contact-means';
import { Contacts } from 'src/app/domain/repositories/contacts';

@Injectable({
  providedIn: 'root'
})
export class ContactDaoSQLiteService implements Contacts {

  constructor(private _connection: ConnectionSQLite, private _means:ContactMeansDaoSQLiteService) { }

  public async list(): Promise<Contact[]> {    
    const database: SQLiteObject = await this._connection.connect();
    const contactsMapped: any = await database.executeSql(_ContactsSqliteSQL.select, []);
    const contactsListed: Contact[] = [];
    for (let i:number = 0; i < contactsMapped.rows.length; i++) {
      const item: any = contactsMapped.rows.item(i);
      const contact: Contact = new Contact(item.contacts_id, item.contacts_name, item.contacts_description);  
      contact.means = await this._means.list(contact);
      try {
        const contactMeansMain: ContactMeans = contact.means.find((item) => item.isMain == true);
        contact.label = contactMeansMain?.value;
      } catch (e) {
        contact.label = '-';
      }
      contactsListed.push(contact);
    }
    return contactsListed;
  }

  async listNames(name: string): Promise<Contact[]> {
    const database: SQLiteObject = await this._connection.connect();
    const contactsMapped: any = await database.executeSql(_ContactsSqliteSQL.selectName, [name]);
    const contactsListed: Contact[] = [];
    for (let i:number = 0; i < contactsMapped.rows.length; i++) {
      const item: any = contactsMapped.rows.item(i);
      const contact: Contact = new Contact(item.contacts_id, item.contacts_name, item.contacts_description);  
      contact.means = await this._means.list(contact);
      contactsListed.push(contact);
    }
    return contactsListed;
  }

  async item(id: number): Promise<Contact> {
    const database: SQLiteObject = await this._connection.connect();
    const contactsMapped: any = await database.executeSql(_ContactsSqliteSQL.selectItem, [id]);
    const item: any = contactsMapped.rows.item(0);
    const contact: Contact = new Contact(item.contacts_id, item.contacts_name, item.contacts_description);
    contact.means = await this._means.list(contact);
    return contact;
  }

  public async post(contact: Contact): Promise<Contact> {
    const database: SQLiteObject = await this._connection.connect();
    const contactsMapped: any = await database.executeSql(_ContactsSqliteSQL.insert, [contact.name, contact.description]);
    contact.id = contactsMapped.insertId;
    const contactMeans:ContactMeans = new ContactMeans(0, contact.means[0].name, contact.means[0].value, true, contact);
    contact.means = [await this._means.post(contactMeans)];
    return contact;
  }

  public async delete(contact: Contact): Promise<boolean> {
    const database: SQLiteObject = await this._connection.connect();
    await database.executeSql(_ContactsSqliteSQL.deleteMean, [contact.id]);
    const contactsMapped: any = await database.executeSql(_ContactsSqliteSQL.delete, [contact.id]);
    return contactsMapped.rowsAffected > 0;
  }

  public async put(contact: Contact): Promise<Contact> {
    const database: SQLiteObject = await this._connection.connect();
    const contactsMapped: any = await database.executeSql(_ContactsSqliteSQL.update, [contact.name, 
        contact.description, contact.id]);
    // if (contactsMapped.rowsAffected == 0) throw Exception('ERROR: Contacts SQL UPDATE');
    return contact;
  }
}


class _ContactsSqliteSQL {

  static readonly select: string = 
      'SELECT contacts_id, contacts_name, contacts_description ' +
      'FROM tb_contacts ORDER BY contacts_id';

  static readonly selectItem: string = 
      'SELECT contacts_id, contacts_name, contacts_description ' +
      'FROM tb_contacts ' +
      'WHERE contacts_id = ? ';

  static readonly selectName: string = 
      'SELECT contacts_id, contacts_name, contacts_description ' +
      'FROM tb_contacts WHERE contacts_name = ? ';

  static readonly insert: string = 
      'insert into tb_contacts(contacts_name, contacts_description) ' +
      'values(?, ?)';

  static readonly update: string = 
      'update tb_contacts set contacts_name=?, contacts_description=? ' +
      'where contacts_id=?';

  static readonly delete: string = 'DELETE FROM tb_contacts WHERE contacts_id = ?';

  static readonly deleteMean: string = 'DELETE FROM tb_contact_means WHERE contacts_id = ?';
}