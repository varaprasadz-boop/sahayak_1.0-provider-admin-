import { Component, OnInit } from '@angular/core';
import { Content } from '../models/content.model';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { DataService } from '../services/data.service';
import { ModalController } from '@ionic/angular';
import { ViewContentPage } from '../view-content/view-content.page';
import { AddContentPage } from '../add-content/add-content.page';

@Component({
  selector: 'app-content-management',
  templateUrl: './content-management.page.html',
  styleUrls: ['./content-management.page.scss'],
})
export class ContentManagementPage implements OnInit {

  public content : Content[] = [];
  public constructor(private data : DataService, private modalController: ModalController) { }

  public ngOnInit() : void {
    this.getContent();
  }
  public getContent() : void {
    this.data.getContent().subscribe(res => {
      this.content = res
      console.log(this.content);
      
    })
  }
  public async viewContent(content : Content) : Promise<void> {
    const modal = await this.modalController.create({
      component: ViewContentPage,
      backdropDismiss: true,
      componentProps: {
        content: content
      }
    });

    await modal.present();
  }
  public async editContent(content : Content) : Promise<void> {
    const modal = await this.modalController.create({
      component: AddContentPage,
      backdropDismiss: false,
      componentProps: {
        content: content,
        type: 'edit'
      }
    });

    await modal.present();
  }
  public deleteContent(content : Content) : void {
    console.log(content);
  }
}
