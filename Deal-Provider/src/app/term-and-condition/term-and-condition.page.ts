import { Component, OnInit } from '@angular/core';
import { Content } from '../model/content.model';
import { DataService } from '../services/data.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-term-and-condition',
  templateUrl: './term-and-condition.page.html',
  styleUrls: ['./term-and-condition.page.scss'],
})
export class TermAndConditionPage implements OnInit {

  public content : Content = {data: '', title: '', type: ''};
  public constructor(private data : DataService, public modalController: ModalController) { }

  public ngOnInit() : void {
    this.getAllContent();
  }
  public getAllContent() : void {
    this.data.getAllContent().subscribe(res => {
      console.log(res);
      res.forEach(element => {
        console.log(element);
        if(element.type == 'terms-provider') {
          this.content = element;
      
        }
      })
    });
  }

}
