 

import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { Category } from '../models/category';
import { DataService } from '../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { doc, getFirestore, updateDoc } from "firebase/firestore";

@Component({
  selector: 'app-edit-subcategories',
  templateUrl: './edit-subcategories.page.html',
  styleUrls: ['./edit-subcategories.page.scss'],
})
export class EditSubcategoriesPage implements OnInit {

  public name;
  public uploadFile;
  public imageView;
  public spin = false;
  public category
  public categories: Category[] = [];
  public id
  public db = getFirestore();
  public customAlertOptions = {
    backdropDismiss: false
  };

  constructor(
    public toastCtrl: ToastController,
    public dataService: DataService,
    public route: ActivatedRoute,
    public alertCtrl: AlertController,
    public navCtrl: NavController) { 

      this.id = this.route.snapshot.paramMap.get('id')
      this.dataService.getSubCategory(this.id).subscribe((data)=> {
        this.name = data.name;
        this.imageView = data.image;
        this.category = data.category
      })

      this.dataService.getCategories().subscribe((data) => {
        if(data != null){
          this.categories = data;
          this.categories = this.categories.reverse()
         }
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
    this.spin = true;
    if(this.uploadFile){
      await this.dataService.updateSubCategory(this.uploadFile, this.name, this.category, this.id);
      this.navCtrl.pop()
    } 
    else {
      const catRef = doc(this.db, "sub-categories", this.id);
       await updateDoc(catRef, {
        name: this.name,
        category: this.category
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

