import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import {
  Auth,
  signOut,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  loader: any;
  constructor(private toastCtrl: ToastController, private loadCtrl: LoadingController, public auth: Auth) { }

  showToast(message) {
    this.toastCtrl.create({
      message: message,
      duration: 2000
    }).then(r => r.present());
  }

  showLoader() {
    this.loadCtrl.create({ spinner: 'circles', duration: 5000 }).then(res => {
      this.loader = res;
      this.loader.present();
    })
  }

  hideLoader() {
    if (this.loader != null) {
      this.loader.dismiss();
      this.loader = null
    }
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }



}
