import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular'; 
import { AddAddressPage } from '../add-address/add-address.page';
import { Address } from '../model/address.model';
import { DataService } from '../services/data.service';
import { deleteDoc, doc, getFirestore } from 'firebase/firestore';
@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit {
  private db = getFirestore();
  public address: Address[] = [{
    id: '',
    uid: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    landmark:'',
    area: '',
    cityName: '',
    areaName: '',
    location: '',
    pincode: '',
    latitude: 0,
    longitude: 0,
    locality: ''
  }];
  constructor(private modalCtrl: ModalController, private data : DataService, private alertCtrl: AlertController) { }

  public ngOnInit() : void {
    this.getAddresses();
  }
  public async getAddresses(): Promise<void> {
    // get addresses by uid from firebase
    const s = await this.data.getaddresses(localStorage.getItem('providerUid')).subscribe((data) => {
      if (data) {
        this.address = [];
        data.forEach(item => {
          this.address.push(item as unknown as Address);
        })
      }
    })
  }
  async openModal() {
    const modal = await this.modalCtrl.create({
      component: AddAddressPage,
      componentProps: {
        type: 'add'
      }
    });
    modal.present();
  }
  async editAddress(item: Address) {
    const modal = await this.modalCtrl.create({
      component: AddAddressPage,
      componentProps: {
        type: 'edit',
        address: item
      }
    });
    modal.present();
  }
  public async deleteAddress(item: Address) {
      let alert = await this.alertCtrl.create({
        message: 'Are you sure to Delete?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'alert-button-cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Delete',
            cssClass: 'alert-button-confirm',
            handler: async () => {
              await deleteDoc(doc(this.db, "addresses", item.id));
              // this.warning()
            }
          }
        ]
      });
      alert.present();
  }
}
