import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { ModalController, ViewDidEnter } from '@ionic/angular';
import { Package } from '../model/package';
import { PaymentPage } from '../payment/payment.page';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
})
export class SubscriptionPage implements OnInit, ViewDidEnter {

  public packages: Package[] = [];
  public constructor(private data : DataService, private modalController: ModalController) { }

  public ngOnInit() : void {
    this.getAllPakges();
  }
  public getAllPakges() : void {
    this.data.getPackages().subscribe((data) => {
      this.packages = data;
    })
  }
  public ionViewDidEnter() : void {
    this.getAllPakges();
  }
  public async choosePackage(packageId: string) : Promise<void> {
    console.log(packageId);
    const modal = await this.modalController.create({
      component: PaymentPage,
      initialBreakpoint: 0.8,
      cssClass: 'payment-sheet',
      handle: true,
    });

    await modal.present();
  }
}
