import { Injectable } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { AlertController, ModalController, ToastController } from "@ionic/angular";
import { Contact } from "../domain/entities/contact";
import { ContactMeans } from "../domain/entities/contact-means";
import { ContactMeansModal } from "./contact-means/contact-means.modal";
import { InstructionsModal } from "./instructions/instructions.modal";
import { PreferencesModal } from "./preferences/preferences.modal";

@Injectable({
  providedIn: 'root'
})
export class Commons {

  constructor(private toastController: ToastController, private alertController: AlertController, 
      private modalController: ModalController) { }

  async showNotificationSuccess(message: string): Promise<void> {
    this.showAction(message, 'success');
  }

  async showNotificationError(message: string): Promise<void> {
    this.showAction(message);
  }

  private async showAction(message: string, type: string = 'error'): Promise<void> {
    const toast = await this.toastController.create({
        cssClass: type == 'error' ? 'notification-error' : 'notification-success',
        message: message,
        duration: type == 'error' ? 2000 : 1000
    });
    toast.present();
  }


  public async showConfirmationAlert(header: string, message: string): Promise<any> {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {cssClass: 'alert-cancel', text: 'NAO', role: 'CANCEL'},
        {cssClass: 'alert-ok', text: 'SIM', role: 'OK'}
      ]
    });
    await alert.present();
    return alert.onDidDismiss();
  }

  public async showPreferencesModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: PreferencesModal,
      cssClass: 'preferences-modal',
    });
    await modal.present();
    await modal.onWillDismiss();
  }

  public async showContactMeansModal(contactMeans: ContactMeans, isFirst: boolean = false): Promise<any> {
    const modal = await this.modalController.create({
      component: ContactMeansModal,
      cssClass: 'contact-means-modal',
      componentProps: {
        'contactMeansJSON': JSON.stringify(contactMeans),
        'isFirst': isFirst,
        backdropDismiss: false,
      }
    });
    await modal.present();
    return modal.onWillDismiss();
  }

  public async showInstructionsModal(title: string, text: string): Promise<any> {
    const modal = await this.modalController.create({
      component: InstructionsModal,
      cssClass: 'instructions-modal',
      componentProps: {
        'status': true,
        'title': title,
        'text': text,
        backdropDismiss: false,
      }
    });
    await modal.present();
    return modal.onWillDismiss();
  }

  isFormGroupValid(formGroup: FormGroup) {
    const fields: string[] = Object.keys(formGroup.controls);
    for (let i: number = 0; i < fields.length; i++) {
      const field: string = fields[i];
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.isFormGroupValid(control);
      }
    }
    return formGroup.valid;
  }
}