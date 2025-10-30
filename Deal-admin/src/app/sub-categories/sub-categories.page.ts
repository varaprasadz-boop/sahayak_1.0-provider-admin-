 

import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Subcategory, Category } from '../models/category';
import { DataService } from '../services/data.service';
import { doc, deleteDoc, getFirestore, updateDoc } from "firebase/firestore";
import { Router } from '@angular/router';
import { CheckPermissionService } from '../services/check-permission.service';


@Component({
  selector: 'app-sub-categories',
  templateUrl: './sub-categories.page.html',
  styleUrls: ['./sub-categories.page.scss'],
})
export class SubCategoriesPage implements OnInit {
  public searchText: string=''; 
  public array:any[] = [];
  public subcategories: Subcategory[] = [];
  public categories: Category[] = [];
  public category;
  public subCategory;
  public dummyArray = Array(1);
  public db = getFirestore();
  public type: string = 'name';
  public nazam: any[] = [];
  public nazam1: any;
  public fiteredSubcategories:any[] = [];
p: string|number;
  constructor(
    public alertCtrl: AlertController,
    public router: Router,
    public dataService: DataService,
    public permsision: CheckPermissionService) { 

    this.dataService.getSubCategories().subscribe((data) => {
      if(data != null){
        this.subcategories = data;
        this.subcategories = this.subcategories.reverse();
        this.fiteredSubcategories = this.subcategories.reverse();
        this.dummyArray = []
      } else {
        this.dummyArray = []
      }
     })

     this.dataService.getCategories().subscribe((data) => {
      if(data != null){
        this.categories = data;
        this.categories = this.categories.reverse()
        console.log(this.categories);
        this.dummyArray = []
      } else {
        this.dummyArray = []
      }
     })
  }

 

  ngOnInit() {
  }

  getCategory(category){
    for(let item of this.categories){
      if(item.id === category){
        return item.name
      }
    }
  }
 

 
  edit(id){
    this.router.navigate(['/edit-subcategories', {id:id}])
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
            await deleteDoc(doc(this.db, "sub-categories", id));
            // this.warning()
          }
        }
      ]
    });
    alert.present();
  }

  async warning(){
    let alert = await this.alertCtrl.create({
      header: 'THIS IS DEMO',
      message: 'This is a demo app, you dont have access to Delete',
      buttons: ['Dismiss']
    });
    alert.present();
  }
  goToSubCategory(){
    this.router.navigate(['/add-sub-category'])
  }
  public hasPermission(requiredPermissions: string[]): boolean {
    return this.permsision.hasPermission(requiredPermissions);
  }
  public getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'danger';
      default:
        return '';
    }
  }

  public async changeStatus($event: any, id: any): Promise<void> {
    console.log($event.target.value);
    const catRef = doc(this.db, 'sub-categories', id);
    await updateDoc(catRef, {
      status: $event.target.value,
    });
  }
  public filterByCategory(event:any) : void { 
    if(event.detail.value === 'all') {
      this.fiteredSubcategories = this.subcategories
    } else {
     this.fiteredSubcategories = this.subcategories.filter(subcategory => subcategory.category === event.detail.value)
    }
  }
}

