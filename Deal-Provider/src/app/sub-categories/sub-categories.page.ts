/*
  Authors : Coders Island
  Website : https://codersisland.com
  App Name : Deal - ionic 6 Buy and Sell, Admin, Admob
  Created : 20-August-2022
  This App Template Source code is licensed as per the
  terms found in the Website https://codersisland.com/license
  Copyright © 2022-present Coders Island.
*/

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatform } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Subcategory } from '../model/category';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-sub-categories',
  templateUrl: './sub-categories.page.html',
  styleUrls: ['./sub-categories.page.scss'],
})
export class SubCategoriesPage implements OnInit {

  public id;
  public name;
  public subcategories: Subcategory[] = [];
  public dummy = Array(1);

  constructor(public route: ActivatedRoute, public router: Router, public dataService: DataService) {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.id)
    this.name = this.route.snapshot.paramMap.get('name');
    this.dataService.getSubCategories(this.id).subscribe((data)=> {
      if(data != null){
        this.subcategories = data;
        this.dummy = [];
      } else {
        this.dummy = [];
      }
    })
   }

  ngOnInit() {
  }

  view(id){
    console.log(id)
    this.router.navigate(['/tabs/items', {id:id}])
  }

  

}
