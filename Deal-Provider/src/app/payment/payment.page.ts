import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  public paymemnt = [
    // {
    //   id: '1',
    //   name: 'Cash at Service',
    //   checked: true,
    //   isActive: true
    // },
    {
      id: '2',
      name: 'Card',
      checked: false,
      isActive: false
    },
    {
      id: '3',
      name: 'Online',
      checked: false,
      isActive: false
    }
  ]
  public constructor(public modalCtrl: ModalController) { }

  public ngOnInit() :void {
  }
  public choosePayment(item): void {
    this.paymemnt.forEach(address => address.checked = false); // Uncheck all addresses
    item.checked = true; // Check the selected address
  }
  public modalDismiss(): void {
    this.modalCtrl.dismiss('confirm');
  }
}
