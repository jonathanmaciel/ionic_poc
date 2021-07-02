import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact } from 'src/app/domain/entities/contact';
import { ContactMeans } from 'src/app/domain/entities/contact-means';
import { ContactMeansSingleRemovedException } from 'src/app/domain/exceptions/contact-means-single-removed-exception';
import { ContactBook } from 'src/app/domain/services/contact-book';
import { InstanceLocator } from 'src/app/instance-locator';
import { Commons } from '../commons';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage {

  private formGroup: FormGroup;
  
  private currentFocusElementId: string = '';

  private contact:Contact;

  constructor(private instaceLocator: InstanceLocator, private commons: Commons, private formBuilder: FormBuilder, 
      private activatedRoute: ActivatedRoute, private router: Router) {
    this.contact = Contact.newInstance();
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params && params.contact) {
        this.contact = JSON.parse(params.contact);
        this.formGroup = this.createFormGroupForStateEdit();
      } else {
        this.formGroup = this.createFormGroupForStateAdd();
      }
    });
  }

  private createFormGroupForStateEdit() {
    return this.formBuilder.group({
      nameInput: ['', Validators.required],
      descriptionInput: ['']
    });
  }

  private createFormGroupForStateAdd() {
    return this.formBuilder.group({
      nameInput: ['', Validators.required],
      descriptionInput: [''],
      contactMeansNameInput: ['', Validators.required],
      contactMeansValueInput: ['', Validators.required]
    });
  }

  async ngAfterViewInit() {
    await this.showInstructionFisrtContactAddDialog();
  }

  async showInstructionFisrtContactAddDialog() {
    const contactBook: ContactBook = await this.instaceLocator.contactBook();
    const isInstructionFisrtContactAddStatus: boolean = await contactBook.getInstructionFisrtContactAddStatus();
    if (this.isEditState || !isInstructionFisrtContactAddStatus) return;
    const title: string = 'Primeiro contato...';
    const content: string = 'Por hora, priorizaremos os dados mais importantes para contactar alguem:<br/><br/> ' +
                            'O <b><i>nome</i></b> que voce ira identificar o contato<br/><br/> ' +
                            'Uma breve <b><i>descricao</i></b> que representa a sua relacao com o contato<br/><br/> ' +
                            'e o <b><i>meio</i></b> para contacta-lo. <br/><br/>Apos isso te mostraremos mais opcoes. ';
    const response: any = await this.commons.showInstructionsModal(title, content);
    if (response && response.data != undefined) await contactBook.setInstructionFisrtContactAddStatus(response.data);
  }

  async showContactMeansFormDialog() {
    const contactBook: ContactBook = await this.instaceLocator.contactBook();
    const isInstructionFisrtContactMeansAddStatus: boolean = await contactBook.getInstructionFisrtContactMeansAddStatus();
    if (!isInstructionFisrtContactMeansAddStatus) return;
    const title: string = 'Meios para contato...';
    const content: string = '<b>Pronto!</b><br/><br/>Agora podemos adicionar meios para contato ao seu novo contato, ' +
                            'basta acionar o botao na barra inferior do App e testar.<br/><br/> ' +
                            'Mais uma coisa, ha uma opcao para determinar o contato principal que sera apresentado junto com as ' +
                            'informacoes do seu contato na tela principal.';
    const response: any = await this.commons.showInstructionsModal(title, content);
    if (response && response.data != undefined) await contactBook.setInstructionFisrtContactMeansAddStatus(response.data);
  }

  get isAddState(): boolean {
    return this.contact.id == 0;
  }

  get isEditState(): boolean {
    return !this.isAddState;
  }

  get toolbarButtonImageURL(): string {
    return this.isAddState ? '/assets/icon/outline_dashboard_customize_white_36dp.png' : '/assets/icon/outline_edit_road_white_24dp.png';
  }

  get toolbarTitleLabel(): string {
    return this.isAddState ? 'Novo Contato' : 'Contato';
  }

  get toolbarSubtitleLabel(): string {
    return this.isAddState ? 'Aqui voce pode cadastrar um novo contato' : 'Aqui voce pode visualizar/atualizar os dados do cantato';
  }

  get isNameInputInvalid (): boolean {
    return this.isInvalidAndDirtyAndTouch('nameInput');
  }

  private isInvalidAndDirtyAndTouch(controlName: string) {
    const control: AbstractControl = this.formGroup.get(controlName);
    return control.invalid && (control.dirty || control.touched);
  }

  get isContactMeansNameInputInvalid (): boolean {
    return this.isInvalidAndDirtyAndTouch('contactMeansNameInput');
  }

  get isContactMeansValueInputInvalid (): boolean {
    return this.isInvalidAndDirtyAndTouch('contactMeansValueInput');
  }

  async onContactButtonAddTouch() {
    if (!this.commons.isFormGroupValid(this.formGroup)) return;
    const contactBook: ContactBook = await this.instaceLocator.contactBook();
    try {
      if (this.isAddState) {
        this.contact = await contactBook.add(this.contact);
        this.showContactMeansFormDialog();
      } else {
        await contactBook.add(this.contact);
      }
      this.commons.showNotificationSuccess('Contato atualizado');
    } catch (e) {
      this.commons.showNotificationError(e.message);
    }
  }

  async onListItemEditButtonTouch(contactMeans: ContactMeans) {
    const isCheckboxEnable: boolean = this.contact.means.length == 1 || contactMeans.isMain;
    const { role } = await this.commons.showContactMeansModal(ContactMeans.copy(contactMeans), isCheckboxEnable);
    if (role == 'updated') {
      const contactBook: ContactBook = await this.instaceLocator.contactBook();
      this.contact.means = (await contactBook.item(this.contact.id)).means;
      this.commons.showNotificationSuccess('Meio para contato atualizado');
    }
  }

  async onListItemRemoveButtonTouch(contactMeans: ContactMeans) {
    const { role } = await this.commons.showConfirmationAlert('Aviso!', 'Voce confirma a exclusao deste contato?');
    if (role == 'CANCEL') return;
    const contactBook: ContactBook = await this.instaceLocator.contactBook();
    try {
      await contactBook.removeContactMeans(contactMeans);
      this.contact.means = (await contactBook.item(this.contact.id)).means;
      this.commons.showNotificationSuccess('Meio para contato removido');
    } catch (e) {
      if (e instanceof ContactMeansSingleRemovedException) {
        const { role } = await this.commons.showConfirmationAlert('Aviso!', e.message);
        if (role == 'CANCEL') return;
        await contactBook.remove(this.contact);
        this.router.navigate(['/']);
      } else {
        this.commons.showNotificationError(e.message);
      }
    }
  }

  async onListItemCheck(contactMeans: ContactMeans) {
    contactMeans.isMain = !contactMeans.isMain;
    contactMeans.contact = this.contact;
    const contactBook: ContactBook = await this.instaceLocator.contactBook()
    await contactBook.addContactMeans(contactMeans);
    this.commons.showNotificationSuccess('Meio para contato principal atualizado para:\n' + contactMeans.name + ': '+ contactMeans.value);
    this.contact.means = (await contactBook.item(this.contact.id)).means;
  }

  async onContactMeansButtonAddTouch() {
    if (!this.commons.isFormGroupValid(this.formGroup)) return;
    const isCheckboxEnable: boolean = this.contact.means.length == 1;
    const data = await this.commons.showContactMeansModal(ContactMeans.newInstance(this.contact), isCheckboxEnable);
    if (data.role == 'updated') {
      const contactBook: ContactBook = await this.instaceLocator.contactBook();
      this.contact.means = (await contactBook.item(this.contact.id)).means;
      this.commons.showNotificationSuccess('Meio para contato atualizado');
    }
  }
  
  get isNameTextFocus(): boolean {
    return this.currentFocusElementId == 'nameInput';
  }
  
  get isDescriptionFocus(): boolean {
    return this.currentFocusElementId == 'descriptionInput';
  }

  get isContactMeansNameInputFocus(): boolean {
    return this.currentFocusElementId == 'contactMeansNameInput';
  }

  get isContactMeansValueInputFocus(): boolean {
    return this.currentFocusElementId == 'contactMeansValueInput';
  }

  onInputFocus(event) {
    this.currentFocusElementId = event.currentTarget.id;
  }

  onInputBlur(event) {
    this.currentFocusElementId = '';
  }
}
