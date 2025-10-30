 

import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-add-categories',
  templateUrl: './add-categories.page.html',
  styleUrls: ['./add-categories.page.scss'],
})
export class AddCategoriesPage {

  public name;
  public uploadFile;
  public imageView;
  public spin = false;

  constructor(
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public dataService: DataService,
    public navCtrl: NavController) { }

  // upload image
  async uploadImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos, // Camera, Photos or Prompt!
    });
     if (image) {
      const base64String:any = 'data:image/jpeg;base64,' + image.base64String;
      const resolution = await this.checkImageResolution(base64String); 
       if (resolution.width <= 500 && resolution.height <= 510) {
         this.imageView = 'data:image/jpeg;base64,' + image.base64String
         this.uploadFile = image;
      } else {
        alert('Image resolution should be less than 500x500');
      }
      //  this.imageView = 'data:image/jpeg;base64,' + image.base64String
      //  this.uploadFile = image
     }
  }

  async setup(){
    this.spin = true;
    await this.dataService.addCategory(this.uploadFile, this.name);
    this.navCtrl.pop()
    // this.warning()
  }

  public checkImageResolution(base64Str: string): Promise<{ width: number, height: number }> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height
        });
      };
    });
  }

  async warning(){
    let alert = await this.alertCtrl.create({
      header: 'THIS IS DEMO',
      message: 'This is a demo app, you dont have access to add because of abuse of data',
      buttons: ['Dismiss']
    });
    alert.present();
  }

}
