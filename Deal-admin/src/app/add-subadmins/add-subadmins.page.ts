import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { ModalController } from '@ionic/angular';
import { premissionsComponent } from '../components/premissions/premissions.component';
import { SubAdmin } from '../models/subadmins.model';
@Component({
  selector: 'app-add-subadmins',
  templateUrl: './add-subadmins.page.html',
  styleUrls: ['./add-subadmins.page.scss'],
})
export class AddSubadminsPage implements OnInit {
  public name;
  public email;
  public password;
  public permissions: SubAdmin[] = [];
  public spin: boolean = false;
  private db = getFirestore();
  private auth = getAuth();
  public permissionsList: SubAdmin[] = [
    { name: 'Home', permissions: [] },
    { name: 'Categories', permissions: [] },
    { name: 'Subcategories', permissions: [] },
    { name: 'Items', permissions: [] },
    { name: 'Calander', permissions: [] },
    { name: 'Service_bookings', permissions: [] },
    { name: 'Cities', permissions: [] },
    { name: 'Areas', permissions: [] },
    { name: 'Subadmins', permissions: [] },
    { name: 'Service_providers', permissions: [] },
    { name: 'Users', permissions: [] },
    { name: 'Packages', permissions: [] },
    { name: 'Reports', permissions: [] },
    { name: 'Content', permissions: [] },
    { name: 'Notifications', permissions: [] },
  ];
  public constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {}

  public ngOnInit(): void {}
  async setup() {
    this.spin = true;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        this.email,
        this.password
      );
      const user = userCredential.user;
      if (user) {
        const userDocRef = doc(this.db, 'users', user.uid);
        await setDoc(userDocRef, {
          name: this.name,
          displayName: this.name,
          email: this.email,
          password: this.password,
          permissions: this.permissionsList,
          status: 'active',
          block: false,
          type: 'admin',
          isSuperAdmin: false,
        });
        console.log('Document written with ID: ', userDocRef.id);
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
    this.navCtrl.pop();
    this.spin = false;
  }
  // this.warning()
  public async openModal(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: premissionsComponent,
      componentProps: {
        value: this.permissionsList,
        type: 'view',
      },
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.permissionsList = data;
      console.log(this.permissionsList);
    }
  }
  
}
