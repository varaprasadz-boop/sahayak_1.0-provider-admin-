import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import domtoimage from 'dom-to-image';
import { DataService } from 'src/app/services/data.service';
import numWords from 'num-words';
import { TitleCasePipe } from '@angular/common';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadString,
} from '@angular/fire/storage';

@Component({
  selector: 'app-invoice-component',
  templateUrl: './invoice-component.component.html',
  styleUrls: ['./invoice-component.component.scss'],
})
export class InvoiceComponentComponent implements OnInit {
  public invoiceDetail: any;
  convertedNumber: any = [];
  currentDate: Date = new Date();
  public setServiceProvidersDetail: any;
  public customers: any[] = [];
  public db = getFirestore();
  capturedImage: string;
  constructor(
    public navParams: NavParams,
    public data: DataService,
    private storage: Storage,
    private modalController: ModalController,
    private loadingController: LoadingController
  ) {
    this.invoiceDetail = this.navParams.get('item');
    console.log(this.invoiceDetail);
    const type = navParams.get('type');
    this.showLoading();
    if (type == 'capture') {
      setTimeout(() => {
        this.captureElementAsImage('captureArea');
      }, 4000);
    }
    this.setServiceProvidersDetail = this.navParams.get('serviceProviders');
    this.convertedNumber = numWords(
      this.invoiceDetail.service.serviceProviderCharge.toFixed(0)
    );
    console.log(this.setServiceProvidersDetail);
    this.data.getCustomersList().subscribe((data) => {
      if (data != null) {
        this.customers = data;
        console.log(this.customers);
      } else {
        console.log('No data');
      }
    });
  }

  ngOnInit() {}

  captureElementAsImage(elementId: string) {
    const node = document.getElementById(elementId);
    domtoimage
      .toPng(node)
      .then(async (dataUrl) => {
        const path1 = `uploads/${this.invoiceDetail.id}/${
          this.invoiceDetail.bookingId + '-invoice.png'
        }`;
        const storageRef1 = ref(this.storage, path1);
        await uploadString(storageRef1, this.removeBase64Prefix(dataUrl), 'base64');
        const invoice = await getDownloadURL(storageRef1);
        updateDoc(doc(this.db, 'bookings', this.invoiceDetail.id), {
          invoicePrintUrl: invoice,
        });
        this.loadingController.dismiss();
        this.modalController.dismiss();
      })
      .catch((error) => {
        console.error('Error capturing element:', error);
        this.loadingController.dismiss();
        this.modalController.dismiss();
      });
  }
  public removeBase64Prefix(dataUrl): string {
    if (dataUrl.startsWith('data:image/png;base64,')) {
      return dataUrl.replace('data:image/png;base64,', '');
    }
    return dataUrl;
  }
  public getCustomerName(customer): string {
    for (let item of this.customers) {
      if (item.id == customer) {
        return item.displayName;
      }
    }
  }
  async showLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 8000,
      spinner: 'bubbles'
    });
    await loading.present();
  }
}
