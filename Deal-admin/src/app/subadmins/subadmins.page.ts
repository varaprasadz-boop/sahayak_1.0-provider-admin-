import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { deleteDoc, doc, getFirestore, updateDoc } from 'firebase/firestore';
import { DataService } from '../services/data.service';
import { SubAdmins } from '../models/subadmins.model';
import { premissionsComponent } from '../components/premissions/premissions.component';
import { Router } from '@angular/router';
import { CheckPermissionService } from '../services/check-permission.service';

@Component({
  selector: 'app-subadmins',
  templateUrl: './subadmins.page.html',
  styleUrls: ['./subadmins.page.scss'],
})
export class SubadminsPage implements OnInit {

  public subAdmins: SubAdmins[] = [];
  public permissionsList: string[]= [  'view_home',  'view_categories',  'view_subcategories',  'view_items',  'view_service_bookings',  'view_cities',  'view_areas',  'view_subadmins',  'view_users',  'view_notifications'];
  private db = getFirestore();
  public constructor(public permsision: CheckPermissionService,private alertCtrl: AlertController, private data: DataService, private modalCtrl: ModalController, private router: Router) {
    
  } 
  public ngOnInit() {
    this.getSubAdmins();
  }
  public async edit(subAdmin) : Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Update Subadmin',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: subAdmin.name
        },
        {
          name: 'email',
          type: 'text',
          value: subAdmin.email
        },
        {
          name: 'password',
          type: 'text',
          value: subAdmin.password
        }
      ],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary alert-button-cancel',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      },
      {
        text: 'Update',
        cssClass: 'alert-button-confirm',
        handler: ( event) => {
          const db = getFirestore();
          const catRef = doc(db, "users", subAdmin.id);
          updateDoc(catRef, {
            name: event.name,
            email: event.email,
            password: event.password
          });
          console.log('Confirm Okay');
        }
      }],
    });

    await alert.present();
  }
  public getSubAdmins(): void {
    this.data.getSubAdmins().subscribe((data) => {
      this.subAdmins = data;
    })
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
  public async changeStatus($event: any, id: any): Promise<void> {
    const db = getFirestore();
    const catRef = doc(db, "users", id);
    await updateDoc(catRef, {
      block: $event.target.value,
    });
  }
  public getStatusColor(status: any): string {
    switch (status) {
      case false: return 'success';
      case true: return 'danger';
      default: return '';
    }
  }
  public openSelector() :void {
    document.getElementById('view-permission')?.click();
  }
  public editPermissions(permission, type) : void {
    if(type=='open-selector')
      {
        document.getElementById('edit-permission')?.click();
      }
    else if(type=='update')
      {
        const db = getFirestore();
        const catRef = doc(db, "users", permission.id);
        updateDoc(catRef, {
          permissions: permission.permissions
        });
      }
  }
  public async openModal(subAdmin): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: premissionsComponent,
      componentProps: {
        value: subAdmin.permissions,
        type: 'edit-permission'
      },
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log(data, role);
    
    if (role === 'confirm') {
      this.permissionsList = data;
    }
    if(role === 'update')
    { 
      console.log(subAdmin);
      subAdmin.permissions = data;
      this.updatePermissions(subAdmin);
    }
  }
  public async updatePermissions(subAdmin): Promise<void> {
    const db = getFirestore();
    const catRef = doc(db, 'users', subAdmin.id);
    updateDoc(catRef, {
      permissions : subAdmin.permissions
    });
  }
  public addSubadmins() : void {
    this.router.navigateByUrl('/add-subadmins');
  }
  public hasPermission(requiredPermissions: string[]): boolean {
    return this.permsision.hasPermission(requiredPermissions);
  }
}
