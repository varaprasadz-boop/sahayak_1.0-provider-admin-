import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { SubAdmin } from 'src/app/models/subadmins.model';

@Component({
  selector: 'app-premissions',
  templateUrl: './premissions.component.html',
  styleUrls: ['./premissions.component.scss'],
})
export class premissionsComponent implements OnInit {
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
    { name: 'Complaints', permissions: [] },
    { name: 'Reports', permissions: [] },
    { name: 'Content', permissions: [] },
    { name: 'Notifications', permissions: [] },
  ];
  public type : string = 'view';
  constructor(private modalCtrl: ModalController, public navParams : NavParams) {
    this.permissionsList = this.navParams.get('value');
    this.type = this.navParams.get('type');
    console.log(this.permissionsList)
  }

  ngOnInit() {}
  cancel() {
    return this.modalCtrl.dismiss('cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.permissionsList, 'confirm');
  }
  update() {
    return this.modalCtrl.dismiss(this.permissionsList, 'update');
  }
  valuePass(event: any, item: SubAdmin, permission: string) {
    const isChecked = event.detail.checked;
    const index = this.permissionsList.findIndex(
      (subAdmin) => subAdmin.name === item.name
    );
    if (index !== -1) {
      if (isChecked) {
        this.permissionsList[index].permissions.push(
          permission + '_' + item.name.toLowerCase()
        );
      } else {
        const permissionIndex =
          this.permissionsList[index].permissions.indexOf(permission);
        this.permissionsList[index].permissions.splice(permissionIndex, 1);
      }
    }
  }
  public checkPermissions(item: SubAdmin, permission: string) : boolean {
    const index = this.permissionsList.findIndex(
      (subAdmin) => subAdmin.name === item.name
    );
    if (index !== -1) {
      return this.permissionsList[index].permissions.includes(
        permission + '_' + item.name.toLowerCase()
      );
    }
  }
}
