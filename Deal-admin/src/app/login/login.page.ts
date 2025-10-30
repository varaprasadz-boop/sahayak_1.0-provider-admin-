 

import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, isPlatform, MenuController, Platform } from '@ionic/angular';
import { getDoc, doc, updateDoc, getFirestore, setDoc } from 'firebase/firestore';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public authForm: FormGroup;
  public isSubmitted = false;
  public isLogin = false;
  public db = getFirestore()
  subscription = new Subscription();
  public banner = 'assets/logo.jpg';
  public showPsw = false;
  public desktop = false;
  mobile = false;

  constructor(
    private readonly alertCtrl: AlertController,
    private readonly formBuilder: FormBuilder,
    public platform: Platform,
    public menuCtrl: MenuController,
    public dataService: DataService,
    private readonly auth: AuthService,
    private readonly router: Router
  ) {
    this.authForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    if(isPlatform('desktop') || isPlatform('ipad')) {
      this.desktop = true;
    } else {
      this.mobile = true;
    }
  }

  ngOnInit() {
    this.menuCtrl.enable(false)
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribeWithPriority(9999, () => {})
  }

  showPassword(){
    this.showPsw = !this.showPsw
    console.log('nazam');
    
  }

  // login function
  async login() {
     this.isSubmitted = true;
    if (!this.authForm.valid){
      console.log('Enter required field')
      return false;
    } else {
    this.isLogin = true;
    try {
      await this.auth.login(this.authForm.value['email'], this.authForm.value['password']).then(async (userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user)
        this.dataService.getUserById(user.uid).subscribe((data:any)=> { 
          console.log(data)
          localStorage.setItem('adminName',JSON.stringify(data.name));
          if(data.block === false && data.type === 'admin') {
            localStorage.setItem('uid', user.uid);
            localStorage.setItem('isLoggedInAdmins', 'true');
            localStorage.setItem('permissions', JSON.stringify(data.permissions));
            this.isLogin = false;
            this.menuCtrl.enable(true)
            this.router.navigateByUrl('/home', {replaceUrl:true });
          } else {
            // this.auth.logout();
            // this.isLogin = false;
            // console.log('Admin only')
          }
        }) 
      })
    } catch (error) {
       this.isLogin = false;
      this.displayAlertMessage(`Either we couldn't find your user or there was a problem with the password`);
     }
    }
  }

  get errorControl() {
    return this.authForm.controls;
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

  
}

