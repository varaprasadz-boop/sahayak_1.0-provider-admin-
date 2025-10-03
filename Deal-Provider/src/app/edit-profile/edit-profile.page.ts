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
import { Subscription } from 'rxjs';
import { getAuth, updateProfile, updateEmail } from "firebase/auth";
import { Auth } from '@angular/fire/auth';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  Storage,
  uploadString,
} from '@angular/fire/storage';
import { UtilityService } from '../model/utility';
import { DataService } from '../services/data.service';
import { TranslateService } from '@ngx-translate/core';
import { AdMob } from '@capacitor-community/admob';
import { Category, Subcategory } from '../model/category';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  public registerData:any=[]
  public cities:any=[];
  public areas:any=[];
  public userSubscription: Subscription;
  public categories: Category[] =[];
  subCategories: Subcategory[] =[];
  public db = getFirestore()
  public photoURL: any;
  accountHolderName:any
  accountNumber:any;
  bankName:any;
  category:any;
  city:any;
  gst:any;
  kycDoc1:any
  kycDoc2:any;
  kycDoc3:any;
  mobile:any;
  name:any;
  password:any;
  phoneNumber:any;
  subCategory:any;
  public displayName: any; 
  public about = '';
  public email: any;
  public uploadFile: any;
  public businessName: any;
  public businessAddress: any;
  public businessGST: any;
  form: any;
  area: any;
  servicesList: any;

  constructor(
    public dataProvider: DataService,
    private authAuths: Auth,
    public util: UtilityService,
    public translate: TranslateService,
    public loadingController: LoadingController,
    private storage: Storage,
    public toastController: ToastController,
    //public uploadProvider: UploadProvider,
    public router: Router,public dataService: DataService) {
      // this.dataService.getCategories().subscribe((data) => {
      //   if(data != null){
      //     this.categories = data;
      //   } else {
      //   }
      //  });
      //  this.dataService.getSubCategoriesList().subscribe((data) => {
      //   if(data != null){
      //     this.subCategories = data;
      //   } else {
  
      //   }
      //  })
     }

  ngOnInit() {
    this.dataService.getCategories().subscribe((data: any) => {
      this.categories = data;
      console.log(this.categories);
      });
      this.dataService.getAllCities().subscribe(data => {
        this.cities = data;
        console.log(this.cities);
        });
        this.dataService.getServices().subscribe((data) => {
          this.servicesList = data;
        })
        this.dataService.getSubCategoriesList().subscribe((data) => {
          this.subCategories = data;
        })
    this.dataProvider.getUserById(localStorage.getItem('providerUid'))
      .subscribe((data:any) => {
       this.registerData=data;
       console.log(this.registerData) 
        if (!data) {
          console.log('no data')
        } else {
          this.dataService.getAllAreas(data.city).subscribe((data) => {
            this.areas = data;
          })
          this.photoURL = data.photoURL;
          this.displayName = data.displayName ?? data.name;
          this.phoneNumber = data.phoneNumber;
          this.email = data.email
          this.businessName = data.businessName;
          this.businessAddress = data.businessAddress;
          this.businessGST = data.businessGST;
        }
      });
    // this.hideBanner()
  }

  async hideBanner() {
    await AdMob.hideBanner();
  }
  categoriesById(event:any){
    this.dataService.getSubCategoriesByCategories(event.target.value).subscribe((data) => {
      console.log(data);
      this.subCategories = data;
      console.log(this.subCategories);
    });
  }
  public selectServices(event:any){ 
    this.dataService.getServices().subscribe((data) => {
      this.servicesList = data;
    })
    // this.dataService.getItems(event.target.value).subscribe((data) => {
    //   this.servicesList = data;
    // })
  }

  selectCity(event:any){
    this.dataService.getAllAreas(event.target.value).subscribe((data) => {
      this.areas = data;
      console.log(this.areas);
    });
  }
  async uploadImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos, // Camera, Photos or Prompt!
    });
    if (image) {
      this.photoURL = 'data:image/jpeg;base64,' + image.base64String
      this.uploadFile = image
    }
  }


  async profileUpdate(cameraFile: Photo, displayName, phoneNumber) {
    const user = this.authAuths.currentUser;
    console.log(user.uid)
    const path = `uploads/${user.uid}/profile.png`;
    const storageRef = ref(this.storage, path);
    try {
      await uploadString(storageRef, cameraFile.base64String, 'base64');
      const imageUrl = await getDownloadURL(storageRef);
      const userRef = doc(this.db, "provider", user.uid);
      localStorage.setItem('photoURL', imageUrl);
      localStorage.setItem('displayName', displayName);
      await updateDoc(userRef, {
        photoURL: imageUrl,
        name:this.registerData.name,
        email:this.registerData.email,
        password:this.registerData.password,
        phoneNumber: this.registerData.mobile,
        category:this.registerData.category,
        subCategory:this.registerData.subCategory,
        // services:this.registerData.servicesList,
        city:this.registerData.city,
        area:this.registerData.area,
        address:this.registerData.address,
        gst:this.registerData.gst,
        kyc1:'',
        kyc2:'',
        kyc3:'',
        accountHolderName:this.registerData.accountHolderName,
        accountNumber:this.registerData.accountNumber,
        bankName:this.registerData.bankName,
      });
      return true;
    } catch (e) {
      return null;
    }
  }

  async profileUpdateName(displayName, about) {
    localStorage.setItem('displayName', displayName);
    const user = this.authAuths.currentUser;
    const userRef = doc(this.db, "provider", user.uid);
    await updateDoc(userRef, {
        name:this.registerData.name,
        email:this.registerData.email,
        password:this.registerData.password,
        phoneNumber: this.registerData.mobile,
        category:this.registerData.category,
        subCategory:this.registerData.subCategory,
        // servicesList:this.registerData.services,
        city:this.registerData.city,
        area:this.registerData.area,
        kyc1:'',
        kyc2:'',
        kyc3:'',
        address:this.registerData.address,
        gst:this.registerData.gst,
        accountHolderName:this.registerData.accountHolderName,
        accountNumber:this.registerData.accountNumber,
        bankName:this.registerData.bankName,
    });
  }

  async setup() {
    const loading = await this.loadingController.create(
      {
        cssClass: 'custom-loading'
      }
    );
    await loading.present();
    const auth = getAuth();
    updateProfile(auth.currentUser, {
      displayName: this.displayName,
    }).then(async () => {
      if (this.uploadFile) {
        await this.profileUpdate(this.uploadFile, this.displayName, this.phoneNumber);
        await loading.dismiss();
        this.presentToast(this.translate.instant('Profile update'), 'bottom', '3000', 'success')
      } else {
        await this.profileUpdateName(this.displayName, this.phoneNumber);
        await loading.dismiss();
        this.presentToast(this.translate.instant('Profile update'), 'bottom', '3000', 'success')
      }
    }).catch(async (error) => { 
      console.log(error)
      await loading.dismiss(); 
    });

  }

  async presentToast(message: string, position: any, duration: any, color: any) {
    const toast = await this.toastController.create({
      message: message,
      position: position,
      duration: duration,
      color: color
    });
    toast.present();
  }
  // getCategory(category){
  //   for(let item of this.categories){
  //     if(item.id === category){
  //       return item.name
  //     }
  //   }
  // }
  // getSubCategory(subcategory){
  //   for(let item of this.subCategories){
  //     if(item.id === subcategory){
  //       return item.name
  //     }
  //   }
  // }

}

