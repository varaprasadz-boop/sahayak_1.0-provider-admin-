import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Category, Subcategory } from 'src/app/models/category';
import { DataService } from 'src/app/services/data.service';
@Component({
  selector: 'app-dropdownmodal',
  templateUrl: './dropdownmodal.component.html',
  styleUrls: ['./dropdownmodal.component.scss'],
})
export class DropdownmodalComponent implements OnInit {
  @Input() bookingdetail: any;
  categories: Category[] = [];
  subCategories: Subcategory[] = [];
  constructor(private modalCtrl: ModalController,public dataService: DataService) {
    this.dataService.getCategories().subscribe((data) => {
      if (data != null) {
        this.categories = data;
      } else {
      }
    });
    this.dataService.getSubCategories().subscribe((data) => {
      if (data != null) {
        this.subCategories = data;
      } else {
      }
    });
   }

  ngOnInit() {}


  cancel() {
    return this.modalCtrl.dismiss('cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss('confirm');
  }

  public getStars(rating): any {
    let starts = [];
    for (let i = 0; i < rating; i++) {
      starts.push(i);
    }
    return starts;
  }

  getCategory(category) {
    for (let item of this.categories) {
      if (item.id === category) {
        return item.name;
      }
    }
  }

  public openMap(address): void {
    window.open(
      `https://maps.google.com/?q=${address.latitude},${address.longitude}`
    );
  }
  getSubCategory(subcategory) {
    for (let item of this.subCategories) {
      if (item.id === subcategory) {
        return item.name;
      }
    }
  }
}
