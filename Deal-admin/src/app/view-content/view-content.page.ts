import { Component, Input, OnInit } from '@angular/core';
import { Content } from '../models/content.model';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-view-content',
  templateUrl: './view-content.page.html',
  styleUrls: ['./view-content.page.scss'],
})
export class ViewContentPage implements OnInit {

  @Input() content: Content;
  public constructor(public modalController: ModalController) { }

  public ngOnInit() : void {
  }

}
