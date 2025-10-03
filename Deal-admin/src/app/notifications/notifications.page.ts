import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';
import { collection, addDoc, getFirestore, deleteDoc, doc } from "firebase/firestore"; 
import { DataService } from '../services/data.service';
import { isPlatform } from '@ionic/angular';
import { CheckPermissionService } from '../services/check-permission.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  notification: any = {};
  notifications: any = [];
  db = getFirestore();
  desktop = false;
  mobile = false;

  constructor(
    private cs: CommonService,
    public dataService: DataService,
    public permsision: CheckPermissionService
  ) {
    if(isPlatform('desktop')) {
      this.desktop = true;
    } else {
      this.mobile = true;
    }
  }

  ngOnInit() {
    this.getAllMessages();
  }

  getAllMessages() {
    this.cs.showLoader();
    this.dataService.getNotifications().subscribe((snapshot: any) => {
      if (snapshot != null) {
        this.notifications = snapshot;
      }
      this.cs.hideLoader();
    });
  }

  async add() {
    this.cs.showLoader();
    // Add a new document with a generated id
    this.notification.date = Date.now()
    const docRef = await addDoc(collection(this. db, "notifications"), this.notification);
    this.cs.hideLoader();
    this.cs.showToast("Notification Added into Queue");

  }

  async remove(id) {
    this.cs.showLoader();
    await deleteDoc(doc(this.db, "notifications", id));
    this.cs.hideLoader();
    this.cs.showToast("Message Deleted");

  }
  public hasPermission(requiredPermissions: string[]): boolean {
    return this.permsision.hasPermission(requiredPermissions);
  }
}
