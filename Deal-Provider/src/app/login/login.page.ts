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
import { Validators, UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, isPlatform, LoadingController, ModalController, Platform } from '@ionic/angular';
import { getDoc, doc, updateDoc, getFirestore, setDoc } from 'firebase/firestore';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TermAndConditionPage } from '../term-and-condition/term-and-condition.page';
import { DataService } from '../services/data.service';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public userDetail:any;
  public authForm: any; 
  public isSubmitted = false;
  showPassword: boolean = false;
  public isLogin = false;
  public db = getFirestore()
  private auths = getAuth();
  subscription = new Subscription();
  public banner = 'assets/image.jpg';
  privacyPolicyChecked: boolean = false;
  public email:any;
  public password:any;
 
  constructor(
    private readonly alertCtrl: AlertController,
    private readonly formBuilder: UntypedFormBuilder,
    public platform: Platform,
    private readonly auth: AuthService,
    private readonly router: Router,
    private modalController: ModalController,public dataService:DataService, private loadingController: LoadingController
  ) {
    this.authForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async ngOnInit() {
    
//     this.isLogin = true;
//     const userCredential = await createUserWithEmailAndPassword(
//       this.auths,
//       this.email,
//       this.password
//     );
//     const user = userCredential.user;
//     console.log(user);
//  this.dataService.getUserById(user.uid).subscribe(res=>{
//   this.userDetail=res;
//   console.log(this.userDetail);
  
//  })

  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribeWithPriority(9999, () => {})
  }
  onCheckboxChange(): void {
    this.privacyPolicyChecked = !this.privacyPolicyChecked;
  } 
  async login(event: Event) {
    event.preventDefault();
    this.presentLoading();
    this.isSubmitted = true;
    if (!this.authForm.valid) {
        console.log('Enter required field');
        this.loadingController.dismiss();
        return;
    }
    const { email, password } = this.authForm.value;
    try {
        const userCredential = await this.auth.login(email, password);
        const user = userCredential.user; 
        localStorage.setItem('providerUid', user.uid);
        localStorage.setItem('isProviderLoggedIn', 'true');
        localStorage.setItem('onboarding', 'true');
        const userDetail = await this.dataService.getUserByIdss(user.uid);
        this.loadingController.dismiss();
        if (userDetail.type === 'provider') {
            if (userDetail.status === 'approved') {
                this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
            } else {
                this.router.navigateByUrl('/view-detail', { replaceUrl: true });
            }
        } else {
            this.router.navigateByUrl('/login', { replaceUrl: true });
        }
    } catch (error) {
        this.loadingController.dismiss();
        if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
            this.displayAlertMessage('Please Use Correct Email or Password');
        } else {
            this.displayAlertMessage(`Please Use Correct Email or Password`);
        }
    }
}

  
  
  

  get errorControl() {
    return this.authForm.controls;
  }

  // navigate to register
  goToRegister(){
    this.router.navigate(['/register'])
  }

  // navigate to forgot password
  goToForgotPassword(){
    this.router.navigate(['/forgot-password'])
  }

  // alert error
  async displayAlertMessage(errorMessage: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      message: errorMessage,
      buttons: [{ text: 'Ok', role: 'cancel' }],
    });
    await alert.present();

    await alert.onDidDismiss();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  public async openTermsCondition() :Promise<void> {
    this.router.navigate(['/term-and-condition']);
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 5000,
      spinner: 'bubbles'
    });
    await loading.present();
  }
}

