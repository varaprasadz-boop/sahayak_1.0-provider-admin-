import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Item } from '../models/item';
import { Category, Subcategory } from '../models/categories';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { AutoCompletePage } from './components/auto-complete/auto-complete.page';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { UtilityService } from './services/utility';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadString,
} from '@angular/fire/storage';
// import { Category, Subcategory } from '../model/category';
@Component({
  selector: 'app-edit-vehicle-list',
  templateUrl: './edit-vehicle-list.page.html',
  styleUrls: ['./edit-vehicle-list.page.scss'],
})
export class EditVehicleListPage implements OnInit {
  public categories:  Category[] = [];
  public uploadFile;
  public subcategories: Subcategory[] = [];
  public imageView;
  public item:any={
    id: '',
    category: '',
    subcategory: '',
    price: '',
    title: '',
    description: '',
    condition: '',
    userId: '',
    seller: '',
    photo: '',
    location: '',
    longitude: 0,
    latitude: 0,
    locality: '',
    allow: false,
    adDate: 0,
    package: '',
    phoneNumber: '',
    payment: '',
    commission:'',
    serviceProviderCharge:'',
    images:'',
    shopid: '',
    review: [],
    adStatus: '',
    block: false,
    approvalTime: '',
    isGST: false,
    buisnessName: '',
    buisnessGST: '',
    buisnessAddress: ''
  };
  public category: string;
  public subcategory: string; 
  public location;
  public latitude;
  public longitude;
  public selectedPackage;
  public locality;
  public db = getFirestore();
  constructor(public dataService: DataService,private loadingController: LoadingController ,private storage: Storage, private modalController: ModalController, private router: Router, private util: UtilityService,public navCtrl: NavController) {
  
     if(history.state.data == undefined){
       this.router.navigate(['/items']);
     } 
     else{
       this.item = history.state.data;
       console.log(this.item);
     }
    this.dataService.getCategories().subscribe((data:any) => {
      if (data != null) {
        this.categories = data;
      } else {
      }
    })
    this.dataService.getSubCategories().subscribe((data) => {
      if (data != null) {
        this.subcategories = data;
      }
    })
   }

  ngOnInit() {}
  // selectCat(ev){
  //   console.log(ev)
  //   this.dataService.getSubCategories(this.category).subscribe((data)=> {
  //     if(data != null){
  //       this.subcategories = data;
  //     }
  //   })
  //  }
  async uploadImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos, 
    });
     if (image) {
      const base64String = 'data:image/jpeg;base64,' + image.base64String;
      const resolution = await this.checkImageResolution(base64String); 
       if (resolution.width <= 500 && resolution.height <= 500) {
        this.item.image = 'data:image/jpeg;base64,'+ image.base64String;
      } else {
        alert('Image resolution should be less than 500x500');
      }
     }
  }


  public async updateVehicleList() {
    this.presentLoading()
    if(this.item.image.includes('http')) {
       
    } else {
      const ids = Date.now();
    const path = `uploads/${ids}/image.png`;
    const storageRef = ref(this.storage, path);
    await uploadString(storageRef, this.item.image.replace(/^data:image\/[a-z]+;base64,/, ""), 'base64');
    const imageUrl = await getDownloadURL(storageRef);
    this.item.image = imageUrl;
    }
    const itemRef = doc(this.db, "services", this.item.id);
    await updateDoc(itemRef, this.item);
    this.util.hide();
    this.util.showToast('Success', 'success', 'bottom');
    this.loadingController.dismiss()
    this.navCtrl.pop();
    this.router.navigate(['/items']);
  }
  updateServiceProviderCharge() { 
    const price = parseFloat(this.item.price as any) || 0;  
    const commission = parseFloat(this.item.commission as any) || 0; 
    const commissionAmount = price * (commission / 100); 
    this.item.serviceProviderCharge = price - commissionAmount;
  }






  getCategory(category) {
    for (let item of this.categories) {
      if (item.id === category) {
        return item.name
      }
    }
  }
  getSubcategory(subcategory){
    for(let item of this.subcategories){
      if (item.id === subcategory){
        return item.name
      }
    }
  }
  getSubcategoryByCategory(category){
    console.log(category)
    this.subcategories = [];
    this.dataService.getSubCategories().subscribe((data) => {
      if (data != null) {
        for(let item of data){
          if (item.category === category){
            this.subcategories.push(item)
          }
        }
      }
    })
    
  }
  async shareLocation() {
    const modal = await this.modalController.create({
      component: AutoCompletePage,
      cssClass: 'half-modal'
    });
    modal.present();
    //Get returned datas
    const { data } = await modal.onWillDismiss();
    if (data === undefined) {
      console.log('No data')
    } else {
      console.log('this is the data', data)
      this.item.location = data.address;
      this.item.latitude = data.lat;
      this.item.longitude = data.long;
      this.item.locality = data.locality;
      console.log(this.longitude, this.latitude, this.location)
    }
  }
  public async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait ...',
      duration: 7000,
      spinner: 'bubbles'
    });
    await loading.present();
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
}
