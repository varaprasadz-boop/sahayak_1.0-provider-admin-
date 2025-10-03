import { Component, OnInit } from '@angular/core';
import { Packages } from '../models/packages';
import { DataService } from '../services/data.service';
import { AlertController, ModalController } from '@ionic/angular';
import { AddPackagePage } from '../add-package/add-package.page';
import { UpdatePackageComponent } from './shared/components/update-package/update-package.component';
import { CheckPermissionService } from '../services/check-permission.service';

@Component({
  selector: 'app-package',
  templateUrl: './package.page.html',
  styleUrls: ['./package.page.scss'],
})
export class PackagePage implements OnInit {

  public packages:Packages[] = []
  public constructor(public permsision: CheckPermissionService,private data : DataService, private alertController: AlertController, private modalController: ModalController) { }

  public ngOnInit():void {
    this.data.getAllPackages().subscribe(res => {
      this.packages = res
    })
  }
  public async deletePackage(id:string):Promise<void>{
    const alert = await this.alertController.create({
      header: 'Delete Package?',
      message: 'Are you sure you want to delete this package?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Delete',
          handler: () => {
            console.log('Confirm Ok');
            this.data.deletePackage(id);
          }
        }
      ]
    });
    await alert.present();
  }
  public async updatePackage(item:Packages):Promise<void>{
    console.log(item);
    const modal = await this.modalController.create({
      component: AddPackagePage,
      componentProps: {
        package : item,
        type: 'update'
      },
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }
  public hasPermission(requiredPermissions: string[]): boolean {
    return this.permsision.hasPermission(requiredPermissions);
  }
}
