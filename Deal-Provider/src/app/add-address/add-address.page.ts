import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Address } from '../model/address.model';
import { DataService } from '../services/data.service';
import { Category } from '../model/category';
import { AutoCompletePage } from '../auto-complete/auto-complete.page';
import { addDoc, collection, doc, getFirestore, updateDoc } from 'firebase/firestore';
@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.page.html',
  styleUrls: ['./add-address.page.scss'],
})
export class AddAddressPage implements OnInit {
  public cities;
  public areas;
  private db = getFirestore();
  public type = 'add';
  @Input() public address:Address = {
    uid: '',
    name: '',
    phone: '',
    address: '',
    landmark:'',
    city: '',
    area: '',
    cityName: '',
    pincode: '',
    areaName: '',
    location: '',
    latitude: 0,
    longitude: 0,
    locality: ''
  }

  public constructor(private modalCtrl: ModalController, private data : DataService, private loadingController: LoadingController) {
    this.data.getAllCities().subscribe((data) => {
      this.cities = data;
    });
   }

  public ngOnInit() :void {
    this.address.uid = localStorage.getItem('providerUid');
    this.chooseCity(this.address.city)
  }
  public chooseCity(event){
    this.data.getAllAreas(this.address.city).subscribe((data) => {
      this.areas = data;
      console.log(this.areas)
    });
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
    this.address.location = data.address;
    this.address.latitude = data.lat;
    this.address.longitude = data.long;
    this.address.locality = data.locality;
    console.log(this.address)
    }
  }
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss('confirm');
  }
  public async goToSubmit() : Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      translucent: true
    });
    await loading.present();
    this.cities.forEach(element => {
      if(element.id === this.address.city){
        this.address.cityName = element.name
      }
    });
    this.areas.forEach(element => {
      if(element.id === this.address.area){
        this.address.areaName = element.name
      }
    });
    // add address
    try {
      const docRef = await addDoc(collection(this.db, "addresses"), this.address);
      console.log("Document written with ID: ", docRef.id);
      loading.dismiss();
      this.modalCtrl.dismiss('confirm');
    } catch (e) {
      console.error("Error adding document: ", e);
      loading.dismiss();
    }
  }
  public async updateAddress(): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      translucent: true
    });
    await loading.present();
    this.cities.forEach(element => {
      if(element.id === this.address.city){
        this.address.cityName = element.name
      }
    });
    this.areas.forEach(element => {
      if(element.id === this.address.area){
        this.address.areaName = element.name
      }
    });
    try {
      const addressRef = doc(this.db, "addresses", this.address.id);
       await updateDoc(addressRef, {
         name: this.address.name,
         phone: this.address.phone,
         address: this.address.address,
         city: this.address.city,
         area: this.address.area,
         landmark: this.address.landmark,
         cityName: this.address.cityName,
         areaName: this.address.areaName,
         location: this.address.location,
         pincode: this.address.pincode,
         latitude: this.address.latitude,
         longitude: this.address.longitude,
         locality: this.address.locality
       });
      loading.dismiss();
      this.modalCtrl.dismiss('confirm');
    } catch (e) {
      console.error("Error adding document: ", e);
      loading.dismiss();
    }
  }
 
}
