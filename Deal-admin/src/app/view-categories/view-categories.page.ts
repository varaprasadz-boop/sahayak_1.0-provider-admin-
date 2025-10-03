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
import { AlertController } from '@ionic/angular';
import { Subcategory, Category } from '../models/category';
import { DataService } from '../services/data.service';
import { doc, deleteDoc, getFirestore } from "firebase/firestore";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-categories',
  templateUrl: './view-categories.page.html',
  styleUrls: ['./view-categories.page.scss'],
})
export class ViewCategoriesPage implements OnInit {

  public subcategories: Subcategory[] = [];
  public categories: Category[] = [];
  public dummyArray = Array(1);
  public db = getFirestore();
  public id;
  public name;

  constructor(
    public alertCtrl: AlertController,
    public router: Router,
    public route: ActivatedRoute,
    public dataService: DataService) { 
    this.id = this.route.snapshot.paramMap.get('id')
    this.dataService.getSubCatbyCat(this.id).subscribe((data) => {
      if(data != null){
        this.subcategories = data;
        this.subcategories = this.subcategories.reverse()
        this.dummyArray = []
      } else {
        this.dummyArray = []
      }
     })

     this.dataService.getCategory(this.id).subscribe((data)=> {
      this.name = data.name
     })

     this.dataService.getCategories().subscribe((data) => {
      if(data != null){
        this.categories = data;
        this.categories = this.categories.reverse()
        this.dummyArray = []
      } else {
        this.dummyArray = []
      }
     })
  }

  ngOnInit() {
  }

  getCategory(category){
    for(let item of this.categories){
      if(item.id === category){
        return item.name
      }
    }
  }

  edit(id){
    this.router.navigate(['/edit-subcategories', {id:id}])
  }

 
  async presentConfirm(id) {
    let alert = await this.alertCtrl.create({
      message: 'Are you sure to Delete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: async () => {
            //await deleteDoc(doc(this.db, "sub-categories", id));
            this.warning()
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


}

