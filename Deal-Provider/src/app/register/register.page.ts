/*
  Authors : Al-Aziz Software Solutions
  Website : https://codersisland.com/
  App Name : My First App - ionic 6 Buy and Sell, Admin, Admob
  Created : 20-August-2022
  This App Template Source code is licensed as per the
  terms found in the Website https://codersisland.com/license
  Copyright © 2022-present Al-Aziz Software Solutions.
*/

import { Component, OnInit,ChangeDetectorRef  } from '@angular/core';
import { Validators, UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicSelectableComponent } from 'ionic-selectable';
import {
  LoadingController,
  AlertController,
  NavController,
  isPlatform,
  ViewDidEnter,
  ModalController,
} from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { getFirestore } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import {
  getDownloadURL,
  ref,
  uploadString,
  Storage,
} from '@angular/fire/storage';
import { addDoc, collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from '../services/data.service';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import firebase from 'firebase/compat/app';
import { AutoCompletePage } from '../auto-complete/auto-complete.page';
import { Category } from '../model/category';
import { OtpService } from '../services/otp.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit, ViewDidEnter {
  addServiceForm: FormGroup;
  imageSource: any;
  public uploadMessage: string = '';
  public uploadMessage2: string = '';
  public uploadMessage3: string = '';
  public allCities: any;
  public allAreas: any;
  public isSelectedKyc: boolean = true;
  public isSelectedKyc2: boolean = true;
  public isSelectedKyc3: boolean = true;
  public categories: Category[];
  public subCategories: any;
  public fileTypeName: any = { kyc1: '', kyc2: '', kyc3: '' };
  public doc1Type: any;
  public doc2Type: any;
  public doc3Type: any;
  public addService: any = {
    name: '',
    address: '',
    location: '',
    latitude: 0,
    longitude: 0,
    locality: '',
    landmark: '',
    mobile: '',
    email: '',
    password: '',
    city: '',
    area: '',
    category: '',
    subCategory: '',
    services: '',
    gst: '',
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    kycDoc1: '',
    kycDoc2: '',
    kycDoc3: '',
  };
  public recaptchaVerifier?: firebase.auth.RecaptchaVerifier;
  showPassword: boolean = false;
  public authForm: any;
  public isSubmitted = false;
  public isRegister = false;
  private db = getFirestore();
  private auths = getAuth();
  privacyPolicyChecked: boolean = false;
  servicesList: any = [];
  kycImageUrl: string;
  kycImageUrl2: string;
  kycImageUrl3: string;

  public isOtpSent: boolean = false;
  public isOtpVerified: boolean = false;
  public otp: any;
  constructor(
    private readonly alertCtrl: AlertController,
    public readonly navCtrl: NavController,
    private readonly auth: AuthService,
    private readonly router: Router,
    private formBuilder: FormBuilder,
    private storage: Storage,
    public dataService: DataService,
    private alertController: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private loadingController: LoadingController,
    private modalCtrl: ModalController,
    private cdr: ChangeDetectorRef,
    private otpService: OtpService
  ) {
    this.addServiceForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      location: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      locality: ['', Validators.required],
      landmark: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      city: ['', Validators.required],
      area: ['', Validators.required],
      category: ['', Validators.required],
      subCategory: ['', Validators.required],
      services: ['', Validators.required],
      gst: ['', [Validators.required]],
      bankName: ['', Validators.required],
      accountHolderName: ['', Validators.required],
      accountNumber: ['', Validators.required],
      ifscCode: ['', Validators.required],
      kycDoc1: ['', Validators.required],
      kycDoc2: ['', Validators.required],
      kycDoc3: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.dataService.getAllCities().subscribe((data) => {
      this.allCities = data;
      console.log(this.allCities);
    });
    this.dataService.getCategories().subscribe((data: any) => {
      this.categories = data;
      console.log(this.categories);
    });
  }
  public ionViewDidEnter(): void {
    console.log('ionViewDidEnter');
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'sign-in-button',
      {
        size: 'invisible',
        callback: (response: any) => {
          console.log(response);
          console.log(this.recaptchaVerifier);
        },
        'expired-callback': () => {},
      }
    );
  }
  get f() {
    return this.addServiceForm.controls;
  }

  onSubmit() {
    if (this.addServiceForm.valid) {
      console.log(this.addServiceForm.value);
    } else {
      alert('Please fill out all required fields correctly.');
    }
  }

  get errorControl() {
    return this.authForm.controls;
  }

  async displayAlertMessage(errorMessage: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      message: errorMessage,
      buttons: [{ text: 'Ok', role: 'cancel' }],
    });
    await alert.present();
    await alert.onDidDismiss();
  }

  goBack() {
    this.navCtrl.pop();
  }

  selectAreaEvent(event:any){
  
     this.addService.area=event.value.id
     
  }

  selectCity(event: any) {
    this.addService.city=event.value.id; 
    this.dataService.getAllAreas(event.value.id).subscribe((data) => {
      this.allAreas = data;
      console.log(this.allAreas);
    });
  }
  categoriesById(event: any) { 
    this.subCategories = []
   this.addService.category=event.value.id
    this.dataService
      .getSubCategoriesByCategories(event.value.id)
      .subscribe((data) => {
        this.subCategories = data;
        console.log(this.subCategories);
      });
  }
  public selectServices(event: any) {
    this.servicesList = [];
    this.addService.subCategory = [];
    const subCategories = event.value;
    const subCategorySet = new Set(subCategories.map((subCategory: any) => subCategory.id));

    subCategories.forEach((element: any) => {
      this.addService.subCategory.push(element.id);
    });
    console.log(this.addService.subCategory);
    // Fetch services and filter based on the selected subCategories
    this.dataService.getServices().subscribe((data) => {
      // Filter services in a single pass
      this.servicesList = data.filter(service => subCategorySet.has(service.subCategory));
      console.log(this.servicesList);
    });
  }
  
  
  
  selectServiceList(event:any){
   this.addService.services=[];
    const services = event.value;
    services.forEach((element: any) => {
      this.addService.services.push(element.id);
    });
  }
  goToPhone() {
    this.router.navigate(['/phone-auth']);
  }

  goToLogin() {
    this.goBack();
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  onCheckboxChange(): void {
    this.privacyPolicyChecked = !this.privacyPolicyChecked;
  }
  public async openTermsCondition(): Promise<void> {
    this.router.navigate(['/term-and-condition']);
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result.split(',')[1];
        this.addService.kycDoc1 = base64String;
        this.doc1Type = file.type;
        this.isSelectedKyc = !this.isSelectedKyc;
        this.fileTypeName.kyc1 = file.name;
        console.log(file.name);
        console.log('Selected file (Base64):', file.type);
      };
      reader.readAsDataURL(file);
    }
  }

  onFileSelected2(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result.split(',')[1];
        this.addService.kycDoc2 = base64String;
        this.doc2Type = file.type;
        this.isSelectedKyc2 = !this.isSelectedKyc2;
        this.fileTypeName.kyc2 = file.name;
        console.log('Selected file (Base64):', file.type);
      };
      reader.readAsDataURL(file);
    }
  }
  onFileSelected3(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result.split(',')[1];
        this.addService.kycDoc3 = base64String;
        this.doc3Type = file.type;
        this.isSelectedKyc3 = !this.isSelectedKyc3;
        this.fileTypeName.kyc3 = file.name;
        console.log(file.name);
        console.log('Selected file (Base64):', file.type);
      };
      reader.readAsDataURL(file);
    }
  }

  async setup() {
    let SrNo = 0;
    this.dataService.getAllServiceProviders().subscribe((data) => {
      SrNo = data.length + 1;
    });
    this.isRegister = true;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auths,
        this.addService.email,
        this.addService.password
      );
      const user = userCredential.user;
      console.log(user);
      if (user) {
        const userDocRef = doc(this.db, 'provider', user.uid);
        const path1 = `uploads/${user.uid}/${
          this.doc1Type == 'application/pdf' ? 'kycDoc1.pdf' : 'kycDoc1.png'
        }`;
        const storageRef1 = ref(this.storage, path1);
        await uploadString(storageRef1, this.addService.kycDoc1, 'base64');
        const doc1 = await getDownloadURL(storageRef1);

        const path2 = `uploads/${user.uid}/${
          this.doc2Type == 'application/pdf' ? 'kycDoc2.pdf' : 'kycDoc2.png'
        }`;
        const storageRef2 = ref(this.storage, path2);
        await uploadString(storageRef2, this.addService.kycDoc2, 'base64');
        const doc2 = await getDownloadURL(storageRef2);

        const path3 = `uploads/${user.uid}/${
          this.doc3Type == 'application/pdf' ? 'kycDoc3.pdf' : 'kycDoc3.png'
        }`;
        const storageRef3 = ref(this.storage, path3);
        await uploadString(storageRef3, this.addService.kycDoc3, 'base64');
        const doc3 = await getDownloadURL(storageRef3);

        if (SrNo) {
          await setDoc(userDocRef, {
            uid: user.uid,
            SrNo: 'SHKP00' + SrNo,
            name: this.addService.name,
            address: this.addService.address,
            location: this.addService.location,
            latitude: this.addService.latitude,
            longitude: this.addService.longitude,
            locality: this.addService.locality,
            landmark: this.addService.landmark,
            mobile: this.addService.mobile,
            email: this.addService.email,
            password: this.addService.password,
            city: this.addService.city,
            area: this.addService.area,
            category: this.addService.category,
            subCategory: this.addService.subCategory,
            // services: this.addService.services,
            gst: this.addService.gst,
            bankName: this.addService.bankName,
            accountHolderName: this.addService.accountHolderName,
            accountNumber: this.addService.accountNumber,
            ifscCode: this.addService.ifscCode,
            kycDoc1: doc1,
            kycDoc2: doc2,
            kycDoc3: doc3,
            status: 'received',
            isOtpVerified: this.isOtpVerified,
            dateOfApproval: '',
            renew: '',
            assignedJobsCount: 0,
            customer: '',
            rating: 0,
            block: false,
            type: 'provider',
            isSuperAdmin: false,
          });
          console.log('Document written with ID: ', userDocRef.id);
          this.router.navigate(['/login']);
          this.isRegister = false;
        }
      }
    } catch (error) {
      this.isRegister = false;
      console.log(error)
      this.presentAlert('Error', 'Email already exists');
    }
  }

  async presentAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      subHeader: message,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.navCtrl.pop();
          },
        },
      ],
    });
    await alert.present();
  }
  async presentActionSheet(element: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      mode: 'ios',
      header: 'Select Options',
      buttons: [
        {
          text: 'Select Camera',
          handler: () => {
            this.presentActionSheet2();
          },
        },
        {
          text: 'Select PDF',
          handler: () => {
            console.log(element);
            document.getElementById(element).click();
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });
    await actionSheet.present();
  }
  async presentActionSheet5(element: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      mode: 'ios',
      header: 'Select Options',
      buttons: [
        {
          text: 'Select Camera',
          handler: () => {
            this.presentActionSheet3();
          },
        },
        {
          text: 'Select PDF',
          handler: () => {
            console.log(element);
            document.getElementById(element).click();
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });
    await actionSheet.present();
  }
  async presentActionSheet8(element: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      mode: 'ios',
      header: 'Select Options',
      buttons: [
        {
          text: 'Select Camera',
          handler: () => {
            this.presentActionSheet4();
          },
        },
        {
          text: 'Select PDF',
          handler: () => {
            console.log(element);
            document.getElementById(element).click();
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });
    await actionSheet.present();
  }
  async presentActionSheet2() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Choose an option',
      mode: 'ios',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Gallery',
          handler: () => {
            this.takePicture(CameraSource.Photos);
          },
        },
        {
          text: 'Camera',
          handler: () => {
            this.takePicture(CameraSource.Camera);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  async presentActionSheet3() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Choose an option',
      mode: 'ios',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Gallery',
          handler: () => {
            this.takePicture2(CameraSource.Photos);
          },
        },
        {
          text: 'Camera',
          handler: () => {
            this.takePicture2(CameraSource.Camera);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }
  async presentActionSheet4() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Choose an option',
      mode: 'ios',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Gallery',
          handler: () => {
            this.takePicture3(CameraSource.Photos);
          },
        },
        {
          text: 'Camera',
          handler: () => {
            this.takePicture3(CameraSource.Camera);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }
  public async takePicture(source: CameraSource): Promise<void> {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: source,
    });  
    this.addService.kycDoc1 = image.base64String.split(';base64,').pop();
    this.kycImageUrl = `data:image/jpeg;base64,${this.addService.kycDoc1}`;
    this.uploadMessage = 'Image uploaded successfully';
    this.cdr.detectChanges();
    console.log(this.addService.kycDoc1);
  }
  
  public async takePicture2(source: CameraSource): Promise<void> {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: source,
    });
    this.addService.kycDoc2 = image.base64String.split(';base64,').pop();
    this.kycImageUrl2 = `data:image/jpeg;base64,${this.addService.kycDoc2}`;
    this.uploadMessage2 = 'Image uploaded successfully';
    this.cdr.detectChanges();
    console.log(this.addService.kycDoc1);
  }
  public async takePicture3(source: CameraSource): Promise<void> {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: source,
    });
    this.addService.kycDoc3 = image.base64String.split(';base64,').pop();
    this.kycImageUrl3 = `data:image/jpeg;base64,${this.addService.kycDoc3}`;
    this.uploadMessage3 = 'Image uploaded successfully';
    this.cdr.detectChanges();
  }
  public signinWithPhoneNumber() {
    this.presentLoading();
    this.otpService.sendOtp(this.addService.mobile).subscribe(({ response, otp }) => {
      console.log('OTP sent successfully', response);
      console.log('Generated OTP:', otp);
      this.otp = otp;
      this.loadingController.dismiss();
      this.OtpVerification();
    }, error => {
      this.loadingController.dismiss();
      console.error('Error sending OTP', error);
    });
  }
  async OtpVerification() {
    const alert = await this.alertController.create({
      header: 'Enter OTP',
      mode: 'ios',
      backdropDismiss: false,
      inputs: [
        {
          name: 'otp',
          type: 'text',
          placeholder: 'Enter your otp',
        },
      ],
      buttons: [
        {
          text: 'Enter',
          handler: (res: { otp: string }) => {
            if(res.otp=== this.otp.toString()){ 
              this.loadingController.dismiss(); 
              this.isOtpVerified = true; 
            }
            else{
              this.loadingController.dismiss();
              this.presentAlert('Error', 'Invalid OTP');
            }
            // this.auth
            //   .enterVerificationCode(res.otp)
            //   .then(async (userData) => {
            //     // this.showSuccess();
            //     console.log(userData.uid);
            //     this.isOtpVerified = true;
            //     this.loadingController.dismiss();
            //   })
            //   .catch((error) => {
            //     this.loadingController.dismiss();
            //     this.presentAlert('Error', 'Invalid OTP');
            //   });
          },
        },
      ],
    });
    await alert.present();
  }
  async shareLocation(){
    const modal = await this.modalCtrl.create({
    component: AutoCompletePage,
    cssClass: 'half-modal'
    });
     modal.present();
    //Get returned data
    const { data } = await modal.onWillDismiss();
    if(data === undefined){
      console.log('No data')
    } else {
    console.log('this is the data', data) 
    this.addService.location = data.address;
    this.addService.latitude = data.lat;
    this.addService.longitude = data.long;
    this.addService.locality = data.locality;
    }
  }
  public async presentLoading(): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 9000,
      spinner: 'bubbles',
    });
    await loading.present();
  }
}
