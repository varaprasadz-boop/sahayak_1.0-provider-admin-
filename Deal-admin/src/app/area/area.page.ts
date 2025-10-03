import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { AlertController } from '@ionic/angular';
import { deleteDoc, doc, getFirestore, updateDoc } from 'firebase/firestore';
import { Router } from '@angular/router';
import { CheckPermissionService } from '../services/check-permission.service';

@Component({
  selector: 'app-area',
  templateUrl: './area.page.html',
  styleUrls: ['./area.page.scss'],
})
export class AreaPage implements OnInit {

  public searchValue: string='';
  public cities: any = [];
  public areas: any = [];
  public db = getFirestore();
  public constructor(public router:Router ,private modalCtrl: ModalController, private data: DataService, private alertController: AlertController,  public permsision: CheckPermissionService) {
   this.data.getAllCities().subscribe((data) => {
     this.cities = data;
   });
   this.data.getAllCityAreas().subscribe((data) => {
     this.areas = data;
     console.log(this.areas);
   })
   }

  ngOnInit() {
  }
  async presentConfirm(id) {
    let alert = await this.alertController.create({
      message: 'Are you sure to Delete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          cssClass: 'alert-button-confirm',
          handler: async () => {
            await deleteDoc(doc(this.db, "cityarea", id));
            // this.warning()
          }
        }
      ]
    });
    alert.present();
  }
  async editArea(id,name) {
    let alert = await this.alertController.create({
      message: 'Update Area',
      inputs: [
        {
          placeholder: 'Area',
          name: 'name',
          type: 'text',
          value: name
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'alert-button-cancel',
          role: 'cancel',
          handler: (event) => {
           
          }
        },
        {
          text: 'Update',
          cssClass: 'alert-button-confirm',
          handler: async (event) => {
            this.update(id,event.name)
          }
        }
      ]
    });
    alert.present();
  }
  async update(id,name){
      const catRef = doc(this.db, "cityarea", id);
       await updateDoc(catRef, {
        name: name
     });
  }
  addArea(){
    this.router.navigate(['/add-area'])
  }
  public hasPermission(requiredPermissions: string[]): boolean {
    return this.permsision.hasPermission(requiredPermissions);
  }
}
