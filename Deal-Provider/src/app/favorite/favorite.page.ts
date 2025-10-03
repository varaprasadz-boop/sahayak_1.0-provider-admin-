import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc, getFirestore, setDoc } from 'firebase/firestore';
import { DataService } from '../services/data.service';
import { Category, Subcategory } from '../model/category';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
})
export class FavoritePage implements OnInit {
  public categories: Category[] = [];
  public subcategories: Subcategory[] = [];
  public category: string;
  public subcategory: string;
  public favorites: boolean = true;
  userId
  db = getFirestore()
  items = []
  dummy = Array(1)

  constructor(public router: Router, public dataService: DataService) { 
    this.dataService.getUserById(localStorage.getItem('providerUid')).subscribe((data)=> {
      if(data != null){
        this.items = data.wishlist;
        this.dummy = []
      } else {
        this.dummy = [];
      }
    })
    this.dataService.getCategories().subscribe((data) => {
      if(data != null){
        this.categories = data;
      }
     })
     this.dataService.getSubCategoriesList().subscribe((data) => {
      if(data != null){
        this.subcategories = data;
      }
     })
  }

  ngOnInit() {
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
 
     getCategory(category:any){
      for(let item of this.categories){
        if(item.id === category){
          return item.name
        }
      }
    }
  
    getSubcategory(subCategories:any){
      for(let item of this.subcategories){
        if(item.id === subCategories){
          return item.name
        }
      }
    }

}
