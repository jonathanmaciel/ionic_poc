import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Contact } from 'src/app/domain/entities/contact';
import { ContactBook } from 'src/app/domain/services/contact-book';
import { InstanceLocator } from '../instance-locator';
import { Commons } from './commons';

@Component({
  selector: 'app-home',
  templateUrl: 'contacts.page.html',
  styleUrls: ['contacts.page.scss'],
})
export class ContactsPage {

  private contactsListed: Contact[] = [];

  constructor(private instaceLocator: InstanceLocator, private commons: Commons,
      private router: Router) { }

  async ionViewDidEnter() {
    await this.listContacts();
  }

  private async listContacts(): Promise<void> {
    const contactBook: ContactBook = await this.instaceLocator.contactBook();
    this.contactsListed = await contactBook.list();
  }

  async onToolbarPreferencesButtonTouch(): Promise<void> {
    await this.commons.showPreferencesModal();
    const contactBook: ContactBook = await this.instaceLocator.contactBook()
    this.contactsListed = await contactBook.list();
  }

  onListItemEditButtonTouch(contact: Contact): void {
    const navigationExtras: NavigationExtras = {queryParams: {contact: JSON.stringify(Contact.copy(contact))}};
    this.router.navigate(['/contacts/edit'], navigationExtras);
  }

  async onListItemRemoveButtonTouch(contact: Contact): Promise<void> {
    const { role } = await this.commons.showConfirmationAlert('Aviso!', 'Voce confirma a exclusao deste contato?');
    if (role == 'CANCEL') return;
    const contactBook: ContactBook = await this.instaceLocator.contactBook();
    await contactBook.remove(contact);
    this.commons.showNotificationSuccess('Contato removido');
    await this.listContacts();
  }

  get isEmptyState(): boolean {
    return this.contactsListed && this.contactsListed.length == 0;
  }

  get isNotEmptyState(): boolean {
    return !this.isEmptyState;
  }
}
