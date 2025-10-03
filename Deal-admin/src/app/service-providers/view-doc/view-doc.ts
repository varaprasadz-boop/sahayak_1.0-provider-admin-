import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-service-providers',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Document</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="modalCtrl.dismiss()">
            <ion-icon slot="start" name="close"></ion-icon>
            Close
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-text-center">
      <div style="display: flex; justify-content:center;" *ngIf="type == 'pdf'">
        <pdf-viewer
          [src]="url"
          [render-text]="true"
          [original-size]="false"
          style="width: 8.3in; height: 11.7in"
        ></pdf-viewer>
      </div>
      <ion-img *ngIf="type == 'png'" [src]="url"></ion-img>
      <!-- <ng-template #corrupted>
        <h2>
            No Document or Corrupted File
        </h2>
      </ng-template> -->
    </ion-content>
  `,
})
export class ViewDocComponent {
  @Input() public type: 'pdf' | 'png';
  @Input() public url: string = '';
  public constructor(public modalCtrl: ModalController) {
    setTimeout(() => {
      console.log(this.type);
    }, 4000);
  }
}
