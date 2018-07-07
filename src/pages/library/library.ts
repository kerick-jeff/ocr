import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { VisionProvider } from '../../providers/vision/vision';
import { UtilitiesProvider } from '../../providers/utilities/utilities';
import { ResultsPage } from '../results/results';

@IonicPage()
@Component({
  selector: 'page-library',
  templateUrl: 'library.html',
})
export class LibraryPage {
  private processed = {} as {
    hasBase64Image: boolean,
    imageData: any,
    results: any
  }

  private images: string[] = [
    'index.jpeg',
    'index2.jpeg',
    'index3.jpeg',
    'index4.jpeg',
    'index5.jpeg',
    'index6.jpeg',
    'index7.jpeg',
    'index8.gif',
    'index9.jpeg',
    'index10.jpeg',
    'index11.jpeg',
  ]

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private vision: VisionProvider,
    private utilities: UtilitiesProvider
  ) { }

  detect(image) {
    // Image path in s3 bucket
    let s3Path = `k3r1ck/plates/${image}`

    let loader = this.loadingCtrl.create({
      content: 'Decoding image...'
    })

    loader.present().then(() => {
      this.vision.detectWithImageSource(s3Path).subscribe((result) => {
        this.saveResults(`/assets/imgs/plates/${image}`, result)
        loader.dismiss()
        this.navCtrl.push(ResultsPage, {
          processed: this.processed
        })
      }, (err) => {
        loader.dismiss()
        this.utilities.alert('Error', err)
      })
    }).catch((err) => {
      loader.dismiss()
      this.utilities.alert('Error', err)
    })
  }

  saveResults(imageData, results) {
    this.processed.hasBase64Image = false
    this.processed.imageData = imageData
    this.processed.results = results
  }
}
