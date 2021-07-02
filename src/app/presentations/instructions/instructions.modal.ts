import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-instructions-modal',
  templateUrl: './instructions.modal.html',
  styleUrls: ['./instructions.modal.scss'],
})
export class InstructionsModal implements OnInit {

  private status: boolean;

  private _text: string;

  private _title: string;

  ngOnInit() { }

  constructor(private navParams: NavParams, private modalController: ModalController) {
    this._title = this.navParams.get('title');
    this._text = this.navParams.get('text');
    this.status = this.navParams.get('status');
  }

  close() {
    this.modalController.dismiss(this.status);
  }
}
