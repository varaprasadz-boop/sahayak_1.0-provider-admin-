 

import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { deleteDoc, doc, getFirestore } from 'firebase/firestore';
import { Item } from '../models/item';
import { Report } from '../models/report';
import { User } from '../models/user';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-feature-items',
  templateUrl: './feature-items.page.html',
  styleUrls: ['./feature-items.page.scss'],
})
export class FeatureItemsPage implements OnInit {

  reports: Report[] = [];
  dummy =  Array(1)
  db = getFirestore()
  users: User[] = []
  items: Item[] = []

  constructor(public dataService: DataService, public alertCtrl: AlertController) {
     this.dataService.getReports().subscribe((data)=> {
      if(data != null){
        this.reports = data;
        this.dummy = []
      } else {
        this.dummy  = []
      }
     })
     this.dataService.getUsers().subscribe((data) => {
      if(data != null){
        this.users = data;
      } else {

      }
     })

     this.dataService.getItems().subscribe((data) => {
      if(data != null){
        this.items = data;
      } 
      else {

      }
     })
   }

  ngOnInit() {
  }

  getUserName(userId){
    for(let item of this.users){
      if(item.id === userId){
        return item.displayName
      }
    }
  }

  getItemName(itemId){
    for(let item of this.items){
      if(item.id === itemId){
        return item.title
      }
    }
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
            await deleteDoc(doc(this.db, "report", id));
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



}
