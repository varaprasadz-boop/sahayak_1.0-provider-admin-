import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subcategory } from 'src/app/models/category';
import { DataService } from 'src/app/services/data.service';
@Component({
  selector: 'app-subcatgory',
  templateUrl: './subcatgory.component.html',
  styleUrls: ['./subcatgory.component.scss'],
})
export class SubcatgoryComponent implements OnInit {
  @Input() specificSubcategory : string[] = [] 
  constructor(private modalCtrl: ModalController,public dataService: DataService) {}

  public ngOnInit() { 
   console.log(this.specificSubcategory);
   
  }

  

  
  cancel() {
    return this.modalCtrl.dismiss('cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss('confirm');
  }

}
