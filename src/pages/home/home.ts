import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { ResultsPage } from '../results/results';;
import { LibraryPage } from '../library/library';
import { VisionProvider } from '../../providers/vision/vision';
import { UtilitiesProvider } from '../../providers/utilities/utilities';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  private processed = {} as {
    imageData: any,
    results: any
  }

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private camera: Camera,
    private vision: VisionProvider,
    private utilities: UtilitiesProvider
  ) { }

  openLibrary() {
    this.navCtrl.push(LibraryPage)
  }

  takePhoto() {
    const options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA
    }

    this.camera.getPicture(options).then((imageData) => {
      this.detect(imageData)
    }).catch((err) => {
      this.utilities.alert('Error', JSON.stringify(err))
    })
  }

  selectPhoto() {
    const options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData) => {
      this.detect(imageData)
    }).catch((err) => {
      this.utilities.alert('Error', JSON.stringify(err))
    })
  }

  private detect(imageData: any) {
    let loader = this.loadingCtrl.create({
      content: 'Decoding image...'
    })
    
    loader.present().then(() => {
      this.vision.detectWithbase64Image(imageData).subscribe((result) => {
        this.saveResults(`data:image/jpeg;base64,${imageData}`, result)
        loader.dismiss()
        this.navCtrl.push(ResultsPage, {
          processed: this.processed
        })
      }, (err) => {
        loader.dismiss()
        this.utilities.alert('Error', JSON.stringify(err))
      })
    }).catch((err) => {
      loader.dismiss()
      this.utilities.alert('Error', JSON.stringify(err))
    })
  }

  private saveResults(imageData, results) {
    this.processed.imageData = imageData
    this.processed.results = results
  }
}
