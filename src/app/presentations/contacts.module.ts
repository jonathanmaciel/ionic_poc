import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ContactsPage } from './contacts.page';

import { ContactsPageRoutingModule } from './contacts-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactPage } from './contact/contact.page';
import { ContactMeansModal } from './contact-means/contact-means.modal';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
    IonicModule,
    ContactsPageRoutingModule
  ],
  declarations: [ContactsPage, ContactPage, ContactMeansModal]
})
export class ContactsPageModule {}
