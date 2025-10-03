import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { Category } from '../models/category';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-add-sub-category',
  templateUrl: './add-sub-category.page.html',
  styleUrls: ['./add-sub-category.page.scss'],
})
export class AddSubCategoryPage implements OnInit {

  public name;
  public uploadFile;
  public imageView;
  public spin = false;
  public category;
  public db = getFirestore();
  public categories: Category[] = [];
  public customAlertOptions = {
    backdropDismiss: false
  };

  constructor(
    public toastCtrl: ToastController,
    public dataService: DataService,
    public alertCtrl: AlertController,
    public navCtrl: NavController) { 
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

  async setup(){
    this.spin = true;
    if(this.uploadFile){
      await this.dataService.addSubCategory(this.uploadFile, this.name, this.category);
      this.navCtrl.pop()
    } else {
      const docRef = await addDoc(collection(this.db, "sub-categories"), {
        name: this.name,
        image: '',
        category: this.category,
        status : 'active'
      });
     this.navCtrl.pop()
    }
    // this.warning()
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
