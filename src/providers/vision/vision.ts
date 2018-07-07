import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API_KEY = "AIzaSyDFdyUlpFMQWzfByFqxhIUHpGUoV2hg2bk";

@Injectable()
export class VisionProvider {
  private apiUrl: string

  constructor(
    public http: HttpClient
  ) { 
    this.apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`
  }

  public detectWithImageSource(imagePath: string) {
    const body = {
      "requests": [
        {
          "image": {
            "source": {
              "gcsImageUri": `gs://${imagePath}`
            }
          },
          "features": [
            {
              "type": "TEXT_DETECTION"
            },
            {
              "type": "LABEL_DETECTION"
            }
          ]
        }
      ]
    }

    return this.http.post(this.apiUrl, body)
  }

  public detectWithbase64Image(base64Image) {
    const body = {
      "requests": [
        {
          "image": {
            "content": base64Image
          },
          "features": [
            {
              "type": "TEXT_DETECTION"
            },
            {
              "type": "LABEL_DETECTION"
            }
          ]
        }
      ]
    }

    return this.http.post(this.apiUrl, body)
  }

  public getText(base64Image) {
    const body = {
      "requests": [
        {
          "image": {
            "content": base64Image
          },
          "features": [
            {
              "type": "TEXT_DETECTION"
            }
          ]
        }
      ]
    }

    return this.http.post(this.apiUrl, body)
  }

  public getLabels(base64Image) {
    const body = {
      "requests": [
        {
          "image": {
            "content": base64Image
          },
          "features": [
            {
              "type": "LABEL_DETECTION"
            }
          ]
        }
      ]
    }

    return this.http.post(this.apiUrl, body)
  }
}
