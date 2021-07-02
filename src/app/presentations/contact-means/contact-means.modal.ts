import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { ContactMeans } from 'src/app/domain/entities/contact-means';
import { ContactBook } from 'src/app/domain/services/contact-book';
import { InstanceLocator } from 'src/app/instance-locator';
import { Commons } from '../commons';

@Component({
  selector: 'app-contact-means-modal',
  templateUrl: './contact-means.modal.html',
  styleUrls: ['./contact-means.modal.scss'],
})
export class ContactMeansModal {

  private formGroup : FormGroup;

  private currentFocusElementId: string = '';
  
  private isCheckboxEnable: boolean;

  private exceptionMessage: string = '';

  private contactMeans: ContactMeans;

  constructor(
      private instaceLocator: InstanceLocator,
      private commons: Commons,
      private formBuilder: FormBuilder, 
      private navParams: NavParams,
      private modalController: ModalController
  ) {
    this.formGroup = this.formBuilder.group({
      contactMeansNameInput: ['', Validators.required],
      contactMeansValueInput: ['', Validators.required],
      contactMeansMain:  ['', Validators.nullValidator]
    });
    this.contactMeans = JSON.parse(this.navParams.get('contactMeansJSON'));
    this.isCheckboxEnable = this.navParams.get('isCheckboxEnable');
  }

  get isContactMeansNameInputInvalid (): boolean {
    return this.isInvalidAndDirtyAndTouch('contactMeansNameInput');
  }

  get isContactMeansValueInputInvalid (): boolean {
    return this.isInvalidAndDirtyAndTouch('contactMeansValueInput');
  }

  private isInvalidAndDirtyAndTouch(controlName: string) {
    const control: AbstractControl = this.formGroup.get(controlName);
    return control.invalid && (control.dirty || control.touched);
  }

  async onUpdateButtonTouch() {
    if (!this.commons.isFormGroupValid(this.formGroup)) return;
    try {
      const contactBook: ContactBook = await this.instaceLocator.contactBook()
      await contactBook.addContactMeans(this.contactMeans);
      this.modalController.dismiss(null, 'updated');
      this.commons.showNotificationSuccess('Meio para contato atualizado');
    } catch (e) {
      this.exceptionMessage = e.message;
    }
  }

  onCancelButtonTouch() {
    this.modalController.dismiss(null, 'notUpdated');
  }

  onInputFocus(event) {
    this.currentFocusElementId = event.currentTarget.id;
  }

  onInputBlur(event) {
    this.currentFocusElementId = '';
  }

  get isCancelable(): boolean {
    return this.isContactMeansValueInputInvalid || this.isContactMeansNameInputInvalid || this.hasExceptionMessage;
  }

  get isContactMeansNameInputFocus(): boolean {
    return this.currentFocusElementId == 'contactMeansNameInput';
  }

  get isContactMeansValueInputFocus(): boolean {
    return this.currentFocusElementId == 'contactMeansValueInput';
  }

  private get hasExceptionMessage(): boolean {
    return this.exceptionMessage && this.exceptionMessage.trim().length > 0;
  }
}
