import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API_KEY = "AIzaSyDFdyUlpFMQWzfByFqxhIUHpGUoV2hg2bk";
const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

@Injectable()
export class VisionProvider {

  constructor(
    public http: HttpClient
  ) { }

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

    return this.http.post(API_URL, body)
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

    return this.http.post(API_URL, body)
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

    return this.http.post(API_URL, body)
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

    return this.http.post(API_URL, body)
  }
}
