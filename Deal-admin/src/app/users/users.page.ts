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
import { AlertController, isPlatform } from '@ionic/angular';
import { deleteDoc, doc, getFirestore, updateDoc } from 'firebase/firestore';
import { User } from '../models/user';
import { DataService } from '../services/data.service';
import { CheckPermissionService } from '../services/check-permission.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  public searchText: string='';
  public cities: any[] = [];
  public areas: any[] = []; 
  users: User[] = [];
  desktop = false;
  mobile = false;
  db = getFirestore()

  constructor(public dataService: DataService, public alertCtrl: AlertController,public permsision: CheckPermissionService) {
    this.dataService.getUsers().subscribe((data) => {
      if(data != null){
        this.users = data;
        console.log(this.users);
      } else {

      }
     })
     if(isPlatform('desktop')) {
      this.desktop = true;
    } else {
      this.mobile = true;
    }
   this.getAllCities();
   this.getAllAreas();
   }

  ngOnInit() {
  }

  public getAllCities(): any {
    this.dataService.getAllCities().subscribe((data) => {
      this.cities = data;
    });
  }
  public getAllAreas(): any {
    this.dataService.getAllCityAreas().subscribe((data) => {
      this.areas = data;
    });
  }

  public getCityName(id: any): any {
   for(let item of this.cities){
     if(item.id == id){
       return item.name
     }
   } 
  }
  public getAreaName(id: any): any {
   for(let item of this.areas){
     if(item.id == id){
       return item.name
     }
   }
  }

  async presentConfirm(id) {
    let alert = await this.alertCtrl.create({
      message: 'Are you sure to Delete?',
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'alert-button-cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          cssClass: 'alert-button-confirm',
          handler: async () => {
            await deleteDoc(doc(this.db, "users", id));
            // this.warning()
          }
        }
      ]
    });
    alert.present();
  }

  async warning(){
    let alert = await this.alertCtrl.create({
      header: 'THIS IS DEMO',
      message: 'This is a demo app, you dont have access to Delete',
      buttons: ['Dismiss']
    });
    alert.present();
  }
  public async changeStatus($event: any, id: any): Promise<void> {
    console.log(this.users);
    const catRef = doc(this.db, "users", id);
    await updateDoc(catRef, {
      block: $event.target.value,
    });
  }

  public hasPermission(requiredPermissions: string[]): boolean {
    return this.permsision.hasPermission(requiredPermissions);
  }
}
