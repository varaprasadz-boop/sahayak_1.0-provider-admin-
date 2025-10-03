/*
  Authors : Al-Aziz Software Solutions
  Website : https://codersisland.com/
  App Name : My First App - ionic 6 Buy and Sell, Admin, Admob
  Created : 20-August-2022
  This App Template Source code is licensed as per the
  terms found in the Website https://codersisland.com/license
  Copyright © 2022-present Al-Aziz Software Solutions.
*/


import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { Category, Subcategory } from '../model/category';
import { DataService } from '../services/data.service';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getFirestore } from 'firebase/firestore';
import { AutoCompletePage } from '../auto-complete/auto-complete.page';
import { UtilityService } from '../model/utility';
import { TranslateService } from '@ngx-translate/core';
import { AdMob } from '@capacitor-community/admob';

@Component({
  selector: 'app-post-ads',
  templateUrl: './post-ads.page.html',
  styleUrls: ['./post-ads.page.scss'],
})
export class PostAdsPage implements OnInit  {
  checkboxChecked: boolean = false;
  public array:any=[{name:'Wellcome',price:'Free',checkboxChecked: false},{name:'Business',price:'299.00',checkboxChecked: false},{name:'Business Pro',price:'499.00',checkboxChecked: false},]
  public categories: Category[] = [];
  public subcategories: Subcategory[] = [];
  public category: any;
  public subcategory;
  public showCat = false;
  public title;
  public price;
  public condition;
  public description;
  public displayName;
  public db = getFirestore();
  public phoneNumber;
  public img = 'assets/9.jpg';
  public camera = '#111111';
  public selectedFiles: any = [];
  public imageSelect = [];
  public url;
  public loading;
  public photoURL;
  public location;
  public latitude;
  public longitude;
  public locality;
  public addStatus;
  public approvalTime;
  public selectedCity;
  public cities = [];
  public buisnessName;
  public buisnessGST;
  public buisnessAddress;
  public isGST:boolean = false;
  public packages = [];
  public packageId;
  public selectedPackage = "Select Package";
  constructor(
    public loadingCtrl: LoadingController,
    public dataService: DataService,
    public util: UtilityService,
    public translate: TranslateService,
    public modalCtrl: ModalController,
    public router: Router,
    ) {
   
     this.dataService.getCategories().subscribe((data) => {
      if(data != null){
        this.categories = data;
      }
     })
     this.dataService.getAllPackages().subscribe((data) => {
      if(data != null){
        this.packages = data;
        console.log(this.packages)
      }
     })
     this.hideBanner()
   }

   async hideBanner(){
    await AdMob.hideBanner();
   }

   selectCat(ev){
    console.log(ev)
    this.showCat = true;
    this.dataService.getSubCategories(this.category).subscribe((data)=> {
      if(data != null){
        this.subcategories = data;
      }
    })
   }

   async shareLocation(){
    const modal = await this.modalCtrl.create({
    component: AutoCompletePage,
    cssClass: 'half-modal'
    });
     modal.present();
    //Get returned data
    const { data } = await modal.onWillDismiss();
    if(data === undefined){
      console.log('No data')
    } else {
    console.log('this is the data', data) 
    this.location = data.address;
    this.latitude = data.lat;
    this.longitude = data.long;
    this.locality = data.locality;
    console.log(this.longitude, this.latitude, this.location)
    }
  }

   ngOnInit() {
    setInterval(()=> {
      this.getUserDetails()
   }, 2000)
  }

 
  removePhoto(image){
    this.imageSelect = this.imageSelect.filter(im => im != image);
  }

   triggerFile(){
    document.getElementById('file').click();
  }
  
  detectFiles() {
    var files = (<HTMLInputElement>document.getElementById('file')).files; // Assuming 'file' is the ID of your input element
    // this.selectedFiles = []; // Assuming 'selectedFiles' is an array to store selected files
    for (var i = 0; i < files.length; i++) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.url = event.target.result; // Assuming 'url' is a property to store the URL of the image
        this.imageSelect.push(this.url); // Assuming 'imageSelect' is an array to store selected image URLs
        // this.selectedFiles.push(files[i]);
      };
      reader.readAsDataURL(files[i]); // Reading each file as data URL
      this.selectedFiles.push(files[i]); // Adding each file to the selectedFiles array
      console.log(files);
    }
  }


  getUserDetails(){ 
    this.dataService.getUserById(localStorage.getItem('providerUid'))
      .subscribe(data => {
      // if the user doesn't exists, show this
      if (!data) {
        console.log('no data')
      } else {
        this.displayName = data.displayName;
        this.photoURL = data.photoURL;
        this.phoneNumber = data.phoneNumber;
       }
     });
  }

  async submit(){
    this.isGST = this.isGST ? true : false;
    this.util.show();
    const promises = [];
    let myId = Date.now();

    for (let i = 0; i < this.imageSelect.length; i++) {
      const base64String = this.imageSelect[i];

      // Convert base64 string to a Blob
      const byteCharacters = atob(base64String.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let j = 0; j < byteCharacters.length; j++) {
        byteNumbers[j] = byteCharacters.charCodeAt(j);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });

      // Create a File object from Blob
      const file = new File([blob], `image_${i}.jpg`, { type: 'image/jpeg' });

      const storage = getStorage();
      const metadata = {
        contentType: "image/jpeg",
      };
      const storageRef = ref(storage, "productImages/" + myId + "/" + file.name);
      promises.push(uploadBytes(storageRef, file, metadata).then(uploadResult => {
        return getDownloadURL(uploadResult.ref);
      }));
    }

    const photos = await Promise.all(promises);
    console.log(photos);
  
    let param = {
      category: this.category,
      subcategory: this.subcategory,
      price: this.price,
      title: this.title,
      description: this.description,
      condition: this.condition,
      userId: localStorage.getItem('providerUid'),
      seller: this.displayName,
      location: this.location,
      longitude: this.longitude,
      latitude: this.latitude,
      allow: true,
      adDate: Date.now(),
      phoneNumber: this.phoneNumber,
      review: [],
      locality: this.locality,
      images: photos,
      adStatus: 'pending',
      approvalTime: 'pending',
      isGST: this.isGST ? true : false,
      buisnessName: this.buisnessName ? this.buisnessName : null,
      buisnessGST: this.buisnessGST ? this.buisnessGST : null,
      buisnessAddress: this.buisnessAddress ? this.buisnessAddress : null
    }
    console.log(param)
    // Add a new document with a generated id.
    const docRef = await addDoc(collection(this.db, "items"), param);
    console.log("Document written with ID: ", docRef.id);
    this.util.hide();
    this.util.showToast(this.translate.instant('Success'), 'success', 'bottom');
    this.router.navigate(['/tabs/home'])
  }
 
  changeColor(item: any, index: number) {
    console.log(item, index)
    this.packages.forEach((el: any, i: number) => {
      el.checkboxChecked = i === index ? !item.checkboxChecked : false;
    });
    this.selectedPackage = this.packages[index].name;
  }
   
}

