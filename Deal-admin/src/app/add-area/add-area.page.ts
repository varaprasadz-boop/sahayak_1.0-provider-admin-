import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, NavController } from '@ionic/angular';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-add-area',
  templateUrl: './add-area.page.html',
  styleUrls: ['./add-area.page.scss'],
})
export class AddAreaPage implements OnInit {
  public cities: any = [];
  public city;
  public areas: Array<{ name: string }> = [{ name: '' }];
  public spin: boolean = false;

  constructor(private modalCtrl: ModalController, private data: DataService, private alertController: AlertController, private navCtrl: NavController) {
    this.data.getAllCities().subscribe((data) => {
      this.cities = data;
    });
  }

  ngOnInit() {}

  addArea() {
    this.areas.push({ name: '' });
  }

  removeArea(index: number) {
    this.areas.splice(index, 1);
  }

  async setup() {
    this.spin = true;
    const cityName = this.cities.find(city => city.id === this.city).name;
    
    for (let area of this.areas) {
      await this.data.addCityArea({
        cityId: this.city,
        name: area.name,
        cityName: cityName
      });
    }
    
    this.navCtrl.pop();
    this.spin = false;
  }
}
