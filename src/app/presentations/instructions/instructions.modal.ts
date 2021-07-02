import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-instructions-modal',
  templateUrl: './instructions.modal.html',
  styleUrls: ['./instructions.modal.scss'],
})
export class InstructionsModal {

  private status: boolean;

  private _text: string;

  private _title: string;

  constructor(private navParams: NavParams, private modalController: ModalController) {
    this._title = this.navParams.get('title');
    this._text = this.navParams.get('text');
    this.status = this.navParams.get('status');
  }

  onUpdateButtonTouch() {
    this.modalController.dismiss(this.status);
  }
}
