import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Item } from '../models/item'; 
import { Category, Subcategory } from '../models/categories';
import { DataService } from '../services/data.service';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { EditVehicleListPage } from '../edit-vehicle-list/edit-vehicle-list.page';
import { Router } from '@angular/router';
import { Service } from '../models/services';
import { CheckPermissionService } from '../services/check-permission.service';
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {
  @Input() public item: Service;
  public categories:  Category[] = [];
  public subcategories: Subcategory[] = [];
  public userList = []
  public seller: string;
  public category: string;
  public subcategory: string;
  public details: any;
  public db = getFirestore();
  public phoneNumber: string;
  constructor(public router:Router,private modalCtrl: ModalController,public dataService: DataService, private modalController: ModalController,private alertController: AlertController, private permission : CheckPermissionService) {
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

  ngOnInit() {
    console.log(this.item);
    
  }
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss('confirm');
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

  getUserImage(){
    for(let item of this.userList){
      if(item.id == this.seller){
        return item.photoURL
      }
    }
  }
  
  getUsername(){
    for(let item of this.userList){
      if(item.id == this.seller){
        return item.displayName
      }
    }
  }
  getTime(){
    for(let item of this.userList){
      if(item.id == this.seller){
        return item.joined
      }
    }
  }
  public getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'success';
      case 'paused':
        return 'warning';
      case 'rejected':
        return 'danger';
      default:
        return '';
    }
  }
  public async changeStatus($event: any, id: any): Promise<void> {
    console.log($event.target.value);
    const catRef = doc(this.db, "services", id);
    await updateDoc(catRef, {
      status: $event.target.value
    });

    this.modalCtrl.dismiss();
  }
  public async editNumber(item) :Promise<void> {
    const alert = await this.alertController.create({
      header: 'Edit Number',
      inputs: [
        {
          name: 'phoneNumber',
          type: 'text',
          value: item.phoneNumber,
          placeholder: 'Phone Number'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Update',
          role: 'confirm',
          handler: async(data) => {
            console.log(item.phoneNumber);
            const catRef = doc(this.db, "items", item.id);
            await updateDoc(catRef, {
              phoneNumber: data.phoneNumber,
            });
            this.modalCtrl.dismiss();
          },
        },
      ],
      backdropDismiss: false
    });
    console.log(this.phoneNumber);
    await alert.present();
  }


  
  openEditServiceList(item: any){
   this.router.navigate(['edit-service-list'], { state: { data: item } })
    // const modal = await this.modalCtrl.create({
    //   component:  EditVehicleListPage,
    //   componentProps:{
    //   'item':item
    //   }
    // });
    // modal.present();
    this.cancel()
  }
  public hasPermission(requiredPermissions: string[]): boolean {
    return this.permission.hasPermission(requiredPermissions);
  }
}
