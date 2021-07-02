import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppPreferences } from '@ionic-native/app-preferences/ngx';
import { ModalController } from '@ionic/angular';
import { Preferences } from 'src/app/infrastructure/preferences';
import { Commons } from '../commons';

@Component({
  selector: 'app-preferences-modal',
  templateUrl: './preferences.modal.html',
  styleUrls: ['./preferences.modal.scss'],
  providers: [
    AppPreferences
  ]
})
export class PreferencesModal {

  static readonly LOCAL_REPOSITORY_CONTENT_HTML = '<p>Um arquivo de banco de dados sera criado neste dispositivo e os dados ' +
                                                  'serao tratados a partir de um repository SQL.</p> ' +
                                                  '<p><i>Este metodo e suportado apenas em <br/><u>emuladores e dispositivos<u></i></p> ';

  static readonly REMOTE_REPOSITORY_CONTENT_HTML = '<p>Os dados serao tratados a partir de um repository HTTP.</p> ' +
                                                   '<p><u>O <i>host</i> e a <i>porta</i> devem ser confirmados:</u></p> ';

  private formGroup : FormGroup;

  private currentFocusElementId: string = '';

  private environmentId: string = Preferences.environmentLocalId;

  private httpURL: string = '';

  private contentHTML: string = PreferencesModal.LOCAL_REPOSITORY_CONTENT_HTML;

  constructor(private commons: Commons, private formBuilder: FormBuilder, private modalController: ModalController, 
        private appPreferences: AppPreferences) {
    this.formGroup = this.formBuilder.group({ httpURLNameInput: ['', Validators.required] });
  }

  async ngAfterViewInit() {
    const remoteHttpUrlKey: string = await this.appPreferences.fetch(Preferences.remoteHttpUrlKey);
    const environmentKey: string = await this.appPreferences.fetch(Preferences.environmentKey);
    this.httpURL = remoteHttpUrlKey ? remoteHttpUrlKey : '';
    this.environmentId = environmentKey ? environmentKey : Preferences.environmentLocalId;  
  }

  onRadioButtonChange(event) {
    this.contentHTML = (this.environmentId == Preferences.environmentLocalId) ? PreferencesModal.REMOTE_REPOSITORY_CONTENT_HTML : PreferencesModal.LOCAL_REPOSITORY_CONTENT_HTML;
  }

  get httpURLNameInputInvalid (): boolean {
    return this.isInvalidAndDirtyAndTouch('httpURLNameInput');
  }

  private isInvalidAndDirtyAndTouch(controlName: string) {
    const control: AbstractControl = this.formGroup.get(controlName);
    return control.invalid && (control.dirty || control.touched);
  }

  async onUpdateButtonTouch() {
    this.isLocalState ? await this.updateEnvironmentLocal()  
                      : await this.updateEnvironmentRemote();
  }

  private async updateEnvironmentLocal(): Promise<void> {
    const currentEenvironmentId: string = await this.appPreferences.fetch(Preferences.environmentKey);
    if (this.environmentId == currentEenvironmentId) {
      await this.modalController.dismiss();
      return;
    }
    await this.appPreferences.store(Preferences.environmentKey, this.environmentId);
    this.commons.showNotificationSuccess('Parametros atualizados');
    this.modalController.dismiss(null, 'updated');
  }

  private async updateEnvironmentRemote(): Promise<void> {
    const currentEenvironmentId: string = await this.appPreferences.fetch(Preferences.environmentKey);
    const currentRemoteHttpURL: string = await this.appPreferences.fetch(Preferences.remoteHttpUrlKey);
    if (!this.commons.isFormGroupValid(this.formGroup)) return;
    if (this.environmentId == currentEenvironmentId && this.httpURL == currentRemoteHttpURL) {
      this.modalController.dismiss();
      return;
    }
    await this.appPreferences.store(Preferences.environmentKey, this.environmentId);
    await this.appPreferences.store(Preferences.remoteHttpUrlKey, this.httpURL);
    this.commons.showNotificationSuccess('Parametros atualizados');
    this.modalController.dismiss(null, 'updated');
  }

  onInputFocus(event) {
    this.currentFocusElementId = event.currentTarget.id;
  }

  onInputBlur(event) {
    this.currentFocusElementId = '';
  }

  get isContactMeansNameInputFocus(): boolean {
    return this.currentFocusElementId == 'httpURLNameInput';
  }

  onCancelButtonTouch() {
    this.modalController.dismiss(null, 'notUpdated');
  }

  get isLocalState(): boolean {
    return this.environmentId == Preferences.environmentLocalId;
  }

  get isNotLocalState(): boolean {
    return !this.isLocalState;
  }
}
