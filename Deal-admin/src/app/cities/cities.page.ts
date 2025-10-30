import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AddCitiesPage } from '../add-cities/add-cities.page';
import { DataService } from '../services/data.service';
import { State } from 'country-state-city';
import { UpdateCityModelPage } from '../update-city-model/update-city-model.page';
import { CheckPermissionService } from '../services/check-permission.service';
@Component({
  selector: 'app-cities',
  templateUrl: './cities.page.html',
  styleUrls: ['./cities.page.scss'],
})
export class CitiesPage implements OnInit {
  public cities: any = [];
  searchValue:string=''
p: any;
  public constructor(private modalCtrl: ModalController, private data: DataService, private alertController: AlertController,
    public permsision: CheckPermissionService) {
   this.data.getAllCities().subscribe((data) => {
     this.cities = data;
     console.log(this.cities)
    //  console.log(this.getStates(this.cities[0].stateCode))
   })
   }

  public ngOnInit() :void {
  }

  async addCities() {
    const modal = await this.modalCtrl.create({
    component: AddCitiesPage,
    });
    modal.present();
  }
  public async deleteCity(city) :Promise<void> {
    const modal = await this.alertController.create({
      header: 'Confirm',
      message: 'Do you want to delete?',
      buttons: [
        {
          text: 'Cancel', 
          role: 'cancel',
          cssClass: 'secondary alert-button-cancel',
          handler: (blah) => {
            console.log('Confirm Cancel:', blah);
          },
        },
        {
          text: 'Okay',
          role: 'confirm',
          cssClass: 'secondary alert-button-confirm',
          handler: () => {
            this.data.deleteCity(city);
          },
        },
      ],
    });
    await modal.present(); 
  }
  public async editCity(item: any) {
    const modal = await this.modalCtrl.create({
      component:  UpdateCityModelPage,
      componentProps: {
        item:item
      }
      });
      modal.present();
  }
  // public getStates(city) :any {
  //   const states = State.getStatesOfCountry('IN');
  //   return states.filter((item) => item.isoCode === city)[0].name
  // }
  public hasPermission(requiredPermissions: string[]): boolean {
    return this.permsision.hasPermission(requiredPermissions);
  }
}
