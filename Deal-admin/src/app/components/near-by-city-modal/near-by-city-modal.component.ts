import { Component, OnInit } from '@angular/core';
import { ModalController,NavParams  } from '@ionic/angular';
import { Category, Subcategory } from 'src/app/models/category';
import { DataService } from 'src/app/services/data.service'; 
@Component({
  selector: 'app-near-by-city-modal',
  templateUrl: './near-by-city-modal.component.html',
  styleUrls: ['./near-by-city-modal.component.scss'],
})
export class NearByCityModalComponent implements OnInit {
  public search;
  public ProvidersByCityAreaStore:any=[];
  public categories: Category[] =[];
  subCategories: Subcategory[] =[];
  constructor(private modalCtrl: ModalController,private navParams: NavParams,public dataService:DataService) { 
  const item = this.navParams.get('ProvidersByCityArea');
  console.log(item);
  this.ProvidersByCityAreaStore = item;
  console.log(this.ProvidersByCityAreaStore);
  }

  ngOnInit() {
    this.dataService.getCategories().subscribe((data) => {
      if(data != null){
        this.categories = data;
      } else {
      }
     });
     this.dataService.getSubCategoriesList().subscribe((data) => {
      if(data != null){
        this.subCategories = data;
      } else {
      }
     })
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async confirm() {
    const status = 'Assigned';
    return this.modalCtrl.dismiss(status, 'confirm');
  }

  getCategory(category){
    for(let item of this.categories){
      if(item.id === category){
        return item.name
      }
    }
  }
  getSubCategory(subcategory){
    for(let item of this.subCategories){
      if(item.id === subcategory){
        return item.name
      }
    }
  }

}
