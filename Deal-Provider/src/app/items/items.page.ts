/*
  Authors : Coders Island
  Website : https://codersisland.com
  App Name : Deal - ionic 6 Buy and Sell, Admin, Admob
  Created : 20-August-2022
  This App Template Source code is licensed as per the
  terms found in the Website https://codersisland.com/license
  Copyright © 2022-present Coders Island.
*/

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { Item } from '../model/item';
import { DataService } from '../services/data.service';
import { Service } from '../model/services';
import { Category, Subcategory } from '../model/category';

@Component({
  selector: 'app-items',
  template:``,
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage {

  public id: any;
  public dummyArray = Array(1)
  public categories: Category[] =[];
  subCategories: Subcategory[] =[];
  public items: Service[] = []
  public userId: any;
  public subscription:Boolean = true;
  public db = getFirestore()

  constructor(
    public routes: ActivatedRoute, 
    public router: Router,
    public dataService: DataService, 
    public navCtrl: NavController) {

    this.id = this.routes.snapshot.paramMap.get('id')
    this.dataService.getItems(this.id).subscribe((data)=> {
      if(data != null){
        this.items = data;
        this.dummyArray = [];
      } else {
        this.dummyArray = [];
      }
    })
    this.dataService.getCategories().subscribe((data) => {
      if(data != null){
        this.categories = data;
      } else {
      }
     });
     this.dataService.getSubCategoriesList().subscribe((data) => {
      if(data != null){
        this.subCategories = data;
      } else {

      }
     })
    //  this.dataService.getSubCategories().subscribe((data) => {
    //   if(data != null){
    //     this.subCategories = data;
    //   } else {

    //   }
    //  })
   }

  goBack(){
    this.navCtrl.pop()
  }

  viewDetails(id){
    this.router.navigate(['/item-details', {id:id}])
  }

  call(phone){
    window.open(`tel:${phone}`);
  }

  chat(sellerId, itemId){
    const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if(user) {
         this.userId = user.uid;
         if(this.userId === sellerId){
          console.log('You are seller')
         } else {

          let chatID = this.userId + sellerId + itemId
          const docRef = doc(this.db, "users", localStorage.getItem('providerUid'), 'chatlist', chatID);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            let chataData = docSnap.data();
            let isInRoom = chataData.inRoom;
            let chatWith = chataData.chatWith;
            let lastChat = chataData.lastChat;
            let type = chataData.type;
            let timestamp = chataData.timestamp;
      
            let updateBadgeData =  {inRoom: true, badgeCount: 0, chatID: chatID, chatWith: chatWith, type: type, lastChat: lastChat, timestamp: timestamp, itemId: itemId}
            setDoc(docRef, updateBadgeData);
          } else {
            //setDoc(docRef, updateData);
          }
          this.router.navigate(['/chatting', {
            chatID: chatID,
            userId: sellerId,
            itemId: itemId
          }])
         }
        } else {
          this.router.navigate(['/login'])
        }
      })
     }
     getCategory(category){
      for(let item of this.categories){
        if(item.id === category){
          return item.name
        }
      }
    }
    getSubCategory(subcategory){
      for(let item of this.subCategories){
        if(item.id === subcategory){
          return item.name
        }
      }
    }
  
}
