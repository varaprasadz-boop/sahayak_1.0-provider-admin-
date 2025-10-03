import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { Category, Subcategory } from '../models/category';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.page.html',
  styleUrls: ['./add-service.page.scss'],
})
export class AddServicePage implements OnInit {
  public name;
  public description;
  public price;
  public commission:number = 0;
  public serviceProviderCharge:number = 0;
  public uploadFile;
  public imageView;
  public spin = false;
  public category;
  public subCategory;
  public db = getFirestore();
  public categories: Category[] = [];
  public subCategories: Subcategory[] = [];
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
       });
     
    }
    
  ngOnInit() {
  }
  public getSubCategories() : void {
    this.subCategories = [];
    this.dataService.getSubCategories().subscribe((data) => {
      if(data != null){
        for (let i = 0; i < data.length; i++) {
          if(data[i].category == this.category){
            this.subCategories.push(data[i]);
          }
        }
       }
     })
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
    try {
      console.log('Please select');
      this.spin = true;
      if(this.uploadFile){
        await this.dataService.addService(this.uploadFile, this.name, this.category, this.subCategory, this.description, this.price, this.commission, this.serviceProviderCharge);
        this.navCtrl.pop()
      } else {
        const docRef = await addDoc(collection(this.db, "services"), {
          name: this.name,
          image: '',
          category: this.category,
          subCategory: this.subCategory,
          description: this.description,
          price: this.price,
          commission: this.commission,
          serviceProviderCharge: this.serviceProviderCharge,
          status: 'active',
          created_at: new Date()
        });
        console.log('Service added with ID: ', docRef.id);
        this.navCtrl.pop();
      }
    } catch (error) {
      console.error('Error adding service: ', error);
    } finally {
      this.spin = false;
    }
  }
  

  async warning(){
    let alert = await this.alertCtrl.create({
      header: 'THIS IS DEMO',
      message: 'This is a demo app, you dont have access to add because of abuse of data',
      buttons: ['Dismiss']
    });
    alert.present();
  }
  public calculateCommission() : void{
    const commssion = this.price - ( this.commission * this.price / 100);
    this.serviceProviderCharge = commssion; 
  }
}
