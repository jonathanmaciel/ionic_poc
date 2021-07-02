import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactPage } from './contact/contact.page';
import { ContactsPage } from './contacts.page';

const routes: Routes = [
  {
    path: '',
    component: ContactsPage,
  },
  {
    path: 'edit',
    component: ContactPage,
  },
  {
    path: 'add',
    redirectTo: 'edit'
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactsPageRoutingModule {}
