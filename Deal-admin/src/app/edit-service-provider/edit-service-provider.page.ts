import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import {
  getDownloadURL,
  ref,
  uploadString,
  Storage,
} from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IProvider } from './models/service-provider.model';
@Component({
  selector: 'app-edit-service-provider',
  templateUrl: './edit-service-provider.page.html',
  styleUrls: ['./edit-service-provider.page.scss'],
})
export class EditServiceProviderPage implements OnInit {
  public editServiceProvider: IProvider;
  public allCities: any;
  public allAreas: any;
  public categories: any;
  public subCategories: any;
  public doc1Type: any = '';
  public doc2Type: any = '';
  public doc3Type: any = '';
  public photo: string = '';
  public isPhotoUpdated: boolean = false;
  public spin = false;
  public db = getFirestore();
  uploadFile: any;
  public segment : string = '';
  constructor(
    public dataService: DataService,
    private storage: Storage,
    public router: Router,
    public navCtrl: NavController,
    private loadingController: LoadingController,
    private route: ActivatedRoute
  ) {
    this.editServiceProvider = history.state.item;
    this.segment = history.state.segment;
  }

  ngOnInit() {
    console.log(this.editServiceProvider);

    this.dataService.getAllCities().subscribe((data) => {
      this.allCities = data;
      console.log(this.allCities);
    });

    this.dataService
      .getAllAreas(this.editServiceProvider.city)
      .subscribe((data) => {
        this.allAreas = data;
        console.log(this.allAreas);
      });
    this.dataService
      .getSubCategoriesByCategories(this.editServiceProvider.category)
      .subscribe((data) => {
        this.subCategories = data;
        console.log(this.subCategories);
      });

    this.dataService.getCategories().subscribe((data: any) => {
      this.categories = data;
      console.log(this.categories);
    });
  }

  selectCity(event: any) {
    this.dataService.getAllAreas(event.target.value).subscribe((data) => {
      this.allAreas = data;
      console.log(this.allAreas);
    });
  }
  categoriesById(event: any) {
    this.dataService
      .getSubCategoriesByCategories(event.target.value)
      .subscribe((data) => {
        this.subCategories = data;
        console.log(this.subCategories);
      });
  }

  onFileSelected(event: any, docKey: string) {
    console.log(`Selected file (${docKey}):`, event.target.files);
  
    const files: FileList = event.target.files;
  
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
  
      reader.onload = (e: any) => {
        const result = e.target.result || '';
  
        if (result.startsWith('data:')) {
          // Extract the Base64 content and MIME type
          const base64Content = result.split(',')[1];
          const mimeType = result.split(';')[0].replace('data:', '');
  
          // Update the correct document key in editServiceProvider
          switch (docKey) {
            case 'kycDoc1':
              this.editServiceProvider.kycDoc1 = base64Content;
              this.doc1Type = mimeType;
              break;
  
            case 'kycDoc2':
              this.editServiceProvider.kycDoc2 = base64Content;
              this.doc2Type = mimeType;
              break;
  
            case 'kycDoc3':
              this.editServiceProvider.kycDoc3 = base64Content;
              this.doc3Type = mimeType;
              break;
  
            default:
              console.error(`Unknown docKey: ${docKey}`);
              break;
          }
  
          console.log(`${docKey} updated with MIME type:`, mimeType);
        } else {
          console.error('Invalid Data URL format.');
        }
      };
  
      reader.readAsDataURL(file); // Read the file as a Data URL
    } else {
      console.error('No file selected.');
    }
  }
  
  

  async update() {
    const id = this.editServiceProvider.id;
    this.presentLoading();
  
    const catRef = doc(this.db, 'provider', id);
    let doc1 = this.editServiceProvider.kycDoc1 || 'none';
    let doc2 = this.editServiceProvider.kycDoc2 || 'none';
    let doc3 = this.editServiceProvider.kycDoc3 || 'none';
    let photo = this.editServiceProvider.photoURL || '';
  
    // Upload Document 1 if updated
    if (this.doc1Type !== '') {
      const path1 = `uploads/${id}/${this.doc1Type === 'application/pdf' ? 'kycDoc1.pdf' : 'kycDoc1.png'}`;
      const storageRef1 = ref(this.storage, path1);
      await uploadString(storageRef1, this.editServiceProvider.kycDoc1, 'base64');
      doc1 = await getDownloadURL(storageRef1);
    }
  
    // Upload Document 2 if updated
    if (this.doc2Type !== '') {
      const path2 = `uploads/${id}/${this.doc2Type === 'application/pdf' ? 'kycDoc2.pdf' : 'kycDoc2.png'}`;
      const storageRef2 = ref(this.storage, path2);
      await uploadString(storageRef2, this.editServiceProvider.kycDoc2, 'base64');
      doc2 = await getDownloadURL(storageRef2);
    }
  
    // Upload Document 3 if updated
    if (this.doc3Type !== '') {
      const path3 = `uploads/${id}/${this.doc3Type === 'application/pdf' ? 'kycDoc3.pdf' : 'kycDoc3.png'}`;
      const storageRef3 = ref(this.storage, path3);
      await uploadString(storageRef3, this.editServiceProvider.kycDoc3, 'base64');
      doc3 = await getDownloadURL(storageRef3);
    }
  
    // Upload Photo if updated
    if (this.isPhotoUpdated) {
      const path4 = `uploads/${id}/profile.png`;
      const storageRef4 = ref(this.storage, path4);
      await uploadString(storageRef4, this.photo, 'base64');
      photo = await getDownloadURL(storageRef4);
    }
  
    await updateDoc(catRef, {
      uid: id,
      kycDoc1: doc1,
      kycDoc2: doc2,
      kycDoc3: doc3,
      name: this.editServiceProvider.name,
      address: this.editServiceProvider.address,
      mobile: this.editServiceProvider.mobile,
      email: this.editServiceProvider.email,
      password: this.editServiceProvider.password,
      city: this.editServiceProvider.city,
      area: this.editServiceProvider.area,
      photoURL: photo,
      category: this.editServiceProvider.category,
      subCategory: this.editServiceProvider.subCategory,
      accountHolderName: this.editServiceProvider.accountHolderName,
      accountNumber: this.editServiceProvider.accountNumber,
      bankName: this.editServiceProvider.bankName,
      gst: this.editServiceProvider.gst,
    });
  
    this.isPhotoUpdated = false;
    this.loadingController.dismiss();
    this.router.navigate(['/service-providers'], { queryParams: { segment: this.segment } });
  }
  

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 10000,
      spinner: 'bubbles',
    });
    await loading.present();
  }

  async uploadImage() {
    const image = await Camera.getPhoto({
      quality: 70,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
    });
    if (image) {
      this.photo = 'data:image/jpeg;base64,' + image.base64String;
      this.editServiceProvider.photoURL = image.base64String;
      this.isPhotoUpdated = true;
      this.uploadFile = image;
    }
  }
}
