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
    hasBase64Image: boolean,
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
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG | this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA
    }

    this.camera.getPicture(options).then((imageData) => {
      let base64Image = `data:image/jpeg;base64,${imageData}`

      this.detect(base64Image)
    }).catch((err) => {
      this.utilities.alert('Error', err)
      // 'Error occured while taking photo'
    })
  }

  selectPhoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG | this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData) => {
      let base64Image = `data:image/jpeg;base64,${imageData}`

      this.detect(base64Image)
    }).catch((err) => {
      this.utilities.alert('Error', err)
      // 'Error occured while choosing photo'
    })
  }

  private detect(base64Image: any) {
    let loader = this.loadingCtrl.create({
      content: 'Decoding image...'
    })
    
    loader.present().then(() => {
      this.vision.detectWithbase64Image(base64Image).subscribe((result) => {
        this.saveResults(base64Image, result)
        loader.dismiss()
        this.navCtrl.push(ResultsPage, {
          processed: this.processed
        })
      }, (err) => {
        loader.dismiss()
        this.utilities.alert('Error', err)
        // 'Error occured while detecting text'
      })
    }).catch((err) => {
      loader.dismiss()
      this.utilities.alert('Error', err)
    })
  }

  private saveResults(imageData, results) {
    this.processed.hasBase64Image = true
    this.processed.imageData = imageData
    this.processed.results = results
  }
}
