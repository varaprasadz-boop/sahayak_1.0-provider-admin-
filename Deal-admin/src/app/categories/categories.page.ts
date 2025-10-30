 

import { Component, OnInit } from '@angular/core';
import { AlertController, isPlatform } from '@ionic/angular';
import { Category } from '../models/category';
import { DataService } from '../services/data.service';
import { doc, deleteDoc, getFirestore, updateDoc } from "firebase/firestore";
import { Router } from '@angular/router';
import { CheckPermissionService } from '../services/check-permission.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  public search:string=''; 
  public categories: Category[] = [];
  public dummyArray = Array(1);
  public db = getFirestore();
  desktop =false;
  mobile =true
p: any;

  constructor(
    public alertCtrl: AlertController,
    public router: Router,
    public dataService: DataService, public permsision: CheckPermissionService) { 

    this.dataService.getCategories().subscribe((data) => {
      if(data != null){
        this.categories = data;
        this.categories = this.categories.reverse()
        this.dummyArray = []
      } else {
        this.dummyArray = []
      }
     })
     if(isPlatform('desktop')) {
      this.desktop = true;
    } else {
      this.mobile = true;
    }
  }

  ngOnInit() {
  }

  edit(id){
    this.router.navigate(['/edit-categories', {id:id}])
  }

  view(id){
    this.router.navigate(['/view-categories', {id:id}])
  }

 
  async presentConfirm(id) {
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
            await deleteDoc(doc(this.db, "categories", id));
            // this.warning()
          }
        }
      ]
    });
    alert.present();
  }
  public getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'danger';
      default:
        return '';
    }
  }

  public async changeStatus($event: any, id: any): Promise<void> {
    console.log($event.target.value);
    const catRef = doc(this.db, 'categories', id);
    await updateDoc(catRef, {
      status: $event.target.value,
    });
  }

  async warning(){
    let alert = await this.alertCtrl.create({
      header: 'THIS IS DEMO',
      message: 'This is a demo app, you dont have access to Delete',
      buttons: ['Dismiss']
    });
    alert.present();
  }
  addCategory(){
    this.router.navigate(['/add-categories'])
  }
  public hasPermission(requiredPermissions: string[]): boolean {
    return this.permsision.hasPermission(requiredPermissions);
  }
}
