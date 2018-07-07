import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class UtilitiesProvider {

  constructor(
    public alertCtrl: AlertController
  ) { }

  public alert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: ['OK']
    })

    alert.present()
  }
}
