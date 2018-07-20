import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-results',
  templateUrl: 'results.html',
})
export class ResultsPage {
  private result = {} as {
    hasBase64Image: boolean,
    imageData: any, 
    labels: any,
    texts: any
  }

  private conclusion = {} as {
    isPlate: boolean,
    textDesc: string,
    licensedInCam: boolean
  }

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams
  ) { 
    let processed = this.navParams.get('processed')
    this.result.hasBase64Image = processed.hasBase64Image
    this.result.imageData = processed.imageData
    this.result.labels = processed.results.responses[0].labelAnnotations
    this.result.texts = processed.results.responses[0].textAnnotations
    console.log(this.result)

    // Initialize conclusion object
    this.conclusion = {
      isPlate: false,
      textDesc: '',
      licensedInCam: false
    }
  }

  ionViewDidLoad() {
    for (let i = 0; i < this.result.labels.length; i++) {
      const label = this.result.labels[i];
      
      if(label.description == 'vehicle registration plate') {
        this.conclusion.isPlate = true
        this.conclusion.textDesc = this.result.texts[0].description

        for (let j = 1; j < this.result.texts.length; j++) {
          const text = this.result.texts[j];
          if(text.description.toUpperCase() == 'CMR') {
            this.conclusion.licensedInCam = true
            break
          }
        }

        break
      }
    }
  }
}
