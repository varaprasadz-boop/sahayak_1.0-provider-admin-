/*
  Authors : Coders Island
  Website : https://codersisland.com
  App Name : Deal - ionic 6 Buy and Sell, Admin, Admob
  Created : 20-August-2022
  This App Template Source code is licensed as per the
  terms found in the Website https://codersisland.com/license
  Copyright © 2022-present Coders Island.
*/

import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, ModalController, NavController, Platform } from '@ionic/angular';
import { doc, getDoc, getFirestore, setDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { Chat } from '../model/chat';
import { DataService } from '../services/data.service';
import { FcmService } from '../services/fcm.service';
import { PushNotificationService } from '../services/push-notifications.service';

@Component({
  selector: 'app-chatting',
  templateUrl: './chatting.page.html',
  styleUrls: ['./chatting.page.scss'],
})
export class ChattingPage {

  @ViewChild(IonContent,  { static: true }) content: IonContent;
  public chatID: string;
  public userId: any;
  public displayName: any;
  public photoURL: any;
  public uploadFile: any;
  public online: any;
  public lastSeen: any;
  public typing: any;
  public isFocus: boolean;
  public textMessage = '';
  public imageMessage = '';
  public chatsList = [];
  public isRoom = false;
  public backToBottom: boolean = false;
  public showMenu: boolean = false;
  public name: any;
  public fcm_token: any;
  public db = getFirestore();
  public bookingId;
  public itemName;
  public itemPrice;
  public image;
  public images = [];
  public phoneNumber

  constructor(
    public route: ActivatedRoute, 
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public dataProvider: DataService, 
    public platform: Platform, private fcmService: FcmService, private fcm : PushNotificationService ) {

    this.userId = this.route.snapshot.paramMap.get('userId');
    this.chatID = this.route.snapshot.paramMap.get('chatID');
    this.bookingId = this.route.snapshot.paramMap.get('bookingId');
    this.getDatas();
    this.getItem()
  }


  async updateOnline(){
    const userRef = doc(this.db, "provider", localStorage.getItem('providerUid'));
    await updateDoc(userRef, {
     online: true,
     typing: false
    });

    this.fcm.unRegisterNotifications();
  }

  getItem(){
    this.dataProvider.getItemById(this.bookingId).subscribe(res => {
      this.itemName = res.service.name;
      this.itemPrice = res.service.price;
      this.image = res.service.image;
    })
  }

  getDatas(){
    this.scrollBottom()
    // get user profile
    this.updateOnline();
    this.dataProvider.getUsersById(this.userId)
    .subscribe(res => {
      console.log(res);
      // if the user doesn't exists, show this
      if (!res) {
        console.log('no data')
      } else {
        console.log(res);
        this.displayName = res.displayName;
        this.phoneNumber = res.phoneNumber;
        this.photoURL = res.photoURL;
        this.online = res.online;
        this.lastSeen = res.lastSeen;
        this.typing = res.typing;
        this.fcm_token = res.fcm_token;
      }
    });

    // get my profile
    this.dataProvider.getUserById(localStorage.getItem('providerUid'))
    .subscribe(data => {
      // if the user doesn't exists, show this
      if (!data) {
        console.log('no data')
      } else {
        this.name = data.displayName;
      }
    });

    this.dataProvider.getChats(this.chatID).subscribe((data)=> {
      console.log(data);
      if(data){
        this.chatsList = [];
        data.forEach(async (item) => {
          this.chatsList.push(item as Chat);
          this.scrollBottom();
          let idTo = item.idTo;
          let isread = item.isread;
          if(idTo === localStorage.getItem('providerUid') && isread === false){
            const batch = writeBatch(this.db);
            const messageRef = doc(this.db, "chatroom", this.chatID, this.chatID, item.id);
            batch.update(messageRef, {'isread': true});
            await batch.commit()
          }
        })
      } else {
        console.log('No Chat')
      }
    })
  }

  async onTyping(){
    const userRef = doc(this.db, "provider", localStorage.getItem('providerUid'));
    await updateDoc(userRef, {
     typing: true
    });
  }

  // on focus on message input
  toggleFocus() {
    this.onTyping()
    this.scrollBottom()
    this.showMenu = false
  }
  async onTypingDone(){
    const userRef = doc(this.db, "provider", localStorage.getItem('providerUid'));
    await updateDoc(userRef, {
     typing: false
    });
  }
  scrollBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 500);
   
  }

  getScrollPos(pos: any) {
    if (pos.detail.scrollTop > this.platform.height()) {
         this.backToBottom = false;
    } else {
         this.backToBottom = true;
    }
  }

  gotToBottom() {
    this.content.scrollToBottom(1000);
  }

  async ionViewWillLeave(){
    const docRef = doc(this.db, "provider", localStorage.getItem('providerUid'), 'chatlist', this.chatID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let chataData = docSnap.data();
      let chatWith = chataData.chatWith;
      let lastChat = chataData.lastChat;
      let bookingId = chataData.bookingId;
      let timestamp = chataData.timestamp;
      let type = chataData.type;
      let updateBadgeData =  {inRoom: false, badgeCount: 0, chatID: this.chatID, chatWith: chatWith, type: type, lastChat: lastChat, timestamp: timestamp, bookingId: this.bookingId}
      setDoc(docRef, updateBadgeData);
    } else {
      //setDoc(docRef, updateData);
    }
    const userRef = doc(this.db, "provider", localStorage.getItem('providerUid'));
    await updateDoc(userRef, {
     typing: false,
     online: false,
     lastSeen: Date.now()
    });

    this.fcm.registerNotifications();
  }

  async sends(messageType){
    var d = new Date();
    var n = d.toString();
    let chatData = {
      idFrom: localStorage.getItem('providerUid'),
      idTo: this.userId,
      timestamp: Date.now(),
      bookingId: this.bookingId,
      itemName: this.itemName,
      content: messageType === 'text' ? this.textMessage : this.imageMessage,
      type: messageType,
      isread:false,
    }
    const chatRef = doc(this.db, 'chatroom', this.chatID, this.chatID, n);
    setDoc(chatRef, chatData);

    // check if chatlist data exist
    const docRef = doc(this.db, "users", localStorage.getItem('providerUid'), 'chatlist', this.chatID);
    const docSnap = await getDoc(docRef);
    
    // update lastmessage Data
    let updateLastData =  {
      inRoom: true, 
      badgeCount: 0, 
      type: messageType,
      chatID: this.chatID, 
      chatWith: this.userId, 
      bookingId: this.bookingId,
      itemName: this.itemName,
      lastChat: messageType === 'text' ? this.textMessage : 'Photo Share', 
      timestamp: Date.now()
    }

    if (docSnap.exists()) {
       setDoc(docRef, updateLastData);
    } else {
      setDoc(docRef, updateLastData);
    }
    /*this.dataProvider.sendNotification(this.textMessage, this.displayName, 'chat', this.fcm_token).subscribe((datas) => {
      console.log('send notifications', datas);
    }, error => {
      console.log(error);
    });*/
    // update user chatlist
    this.sendMessageAndToken('New Message', this.textMessage, this.fcm_token);
    this.updateUserChatListField(this.userId, this.textMessage, this.chatID, localStorage.getItem('providerUid'), this.userId, messageType);
    this.updateUserChatListFieldUser(localStorage.getItem('providerUid'), this.textMessage, this.chatID, localStorage.getItem('providerUid'), this.userId, messageType);  
    this.textMessage = '';
    this.offTyping();
    this.scrollBottom() 
  }

  async offTyping(){
    const userRef = doc(this.db, "provider", localStorage.getItem('providerUid'));
    await updateDoc(userRef, {
     typing: false
    });
  }

  async updateUserChatListField(documentID: string, lastMessage: string, chatID, myID, selectedUserID, messageType){
    var userBadgeCount = 0;
    const docRef = doc(this.db, "users", documentID, 'chatlist', chatID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let item = docSnap.data();
      this.isRoom = item.inRoom ?? false;
      if(item != null && documentID != myID && item.inRoom === false){
       userBadgeCount = item.badgeCount;
       userBadgeCount++;
      } 
     } else {
      userBadgeCount++;
     } 
    const chatRef = doc(this.db, 'users', documentID, 'chatlist', chatID);
    setDoc(chatRef, {
      chatID: chatID,
      chatWith: documentID == myID ? selectedUserID : myID,
      lastChat: messageType === 'text' ? lastMessage : 'Photo Share',
      bookingId: this.bookingId,
      itemName: this.itemName,
      type: messageType,
      badgeCount: this.isRoom === true ? 0 : userBadgeCount,
      inRoom: false,
      timestamp: Date.now()
     });
  }

  async updateUserChatListFieldUser(documentID: string, lastMessage: string, chatID, myID, selectedUserID, messageType){
    var userBadgeCount = 0;
    const docRef = doc(this.db, "users", documentID, 'chatlist', chatID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let item = docSnap.data();
      this.isRoom = item.inRoom ?? false;
      if(documentID != myID && item.inRoom === false){
       userBadgeCount = item.badgeCount;
       userBadgeCount++;
      
     } else {
      userBadgeCount++;
     } 
    
    const chatRef = doc(this.db, 'users', documentID, 'chatlist', chatID);
    setDoc(chatRef, {
       chatID: chatID,
       chatWith: documentID == myID ? selectedUserID : myID,
       lastChat: messageType === 'text' ? lastMessage : 'Photo Share',
       type: messageType,
       bookingId: this.bookingId,
       itemName: this.itemName,
       badgeCount: this.isRoom === true ? 0 : userBadgeCount,
       inRoom: false,
       timestamp:Date.now()
     });
    }
  }

  private sendMessageAndToken(title: string, body: string, token:string): void {
    this.fcmService.sendMessageAndGetTokenProvider(title, body, token).subscribe(
      response => {
        console.log('FCM message sent successfully:', response);
      },
      error => {
        console.error('Error sending FCM message:', error);
      }
    );
  }

  call(phone){
    window.open(`tel:${phone}`);
  }

}


