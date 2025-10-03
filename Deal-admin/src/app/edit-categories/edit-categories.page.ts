/*
  Authors : Coders Island
  Website : https://codersisland.com
  App Name : Deal - ionic 6 Buy and Sell, Admin, Admob
  Created : 20-August-2022
  This App Template Source code is licensed as per the
  terms found in the Website https://codersisland.com/license
  Copyright © 2022-present Coders Island.
*/

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { doc, getFirestore, updateDoc } from "firebase/firestore";

@Component({
  selector: 'app-edit-categories',
  templateUrl: './edit-categories.page.html',
  styleUrls: ['./edit-categories.page.scss'],
})
export class EditCategoriesPage implements OnInit {

  public name;
  public uploadFile;
  public imageView;
  public spin = false;
  public id;
  public db = getFirestore()

  constructor(
    public toastCtrl: ToastController,
    public route: ActivatedRoute,
    public dataService: DataService,
    public alertCtrl: AlertController,
    public navCtrl: NavController) { 
      this.id = this.route.snapshot.paramMap.get('id');
      this.dataService.getCategory(this.id).subscribe((data)=> {
        this.name = data.name;
        this.imageView = data.image;
      })
    }

  ngOnInit() {
  }

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


  async update(){
    // this.warning()
    this.spin = true;
    if(this.uploadFile){
      await this.dataService.updateCategory(this.uploadFile, this.name, this.id);
      this.navCtrl.pop()
    } else {
      const catRef = doc(this.db, "categories", this.id);
       await updateDoc(catRef, {
        name: this.name,
     });
     this.navCtrl.pop()
    }
  }

  async warning(){
    let alert = await this.alertCtrl.create({
      header: 'THIS IS DEMO',
      message: 'This is a demo app, you dont have access to Update',
      buttons: ['Dismiss']
    });
    alert.present();
  }

}

