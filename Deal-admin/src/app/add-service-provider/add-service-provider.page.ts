import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { getFirestore } from 'firebase/firestore'; 
import { createUserWithEmailAndPassword,getAuth } from 'firebase/auth'; 
import { getDownloadURL, ref, uploadString,Storage } from '@angular/fire/storage'; 
import {addDoc,collection,doc, setDoc,updateDoc} from 'firebase/firestore';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { finalize } from 'rxjs/operators'; 
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-service-provider',
  templateUrl: './add-service-provider.page.html',
  styleUrls: ['./add-service-provider.page.scss'],
})
export class AddServiceProviderPage implements OnInit {
 public allCities:any;
 public allAreas:any;
 public categories:any;
 public subCategories:any;
 private db = getFirestore();
 private auth = getAuth();
 public srNo:number=0;
 public uploadFile;
 public imageView;
 private maxFileSize = 1048487;
 public spin: boolean = false;
 public addService:any =  
    { 
      name: '', 
      address: '', 
      photoURL: '',
      mobile: '', 
      email: '', 
      password:'',
      city: '', 
      area: '', 
      category: '', 
      subCategory: '', 
      kycDoc1: '', 
      kycDoc2: '', 
      kycDoc3: '', 
      accountHolderName: '', 
      accountNumber: '', 
      bankName: '', 
      gst:''
    }
  public doc1Type: any;
  public doc2Type: any;
  public doc3Type: any;
    
 
  constructor(public dataService:DataService,  private navCtrl: NavController,
    private modalCtrl: ModalController, private storage: Storage,public router:Router, private loadingController: LoadingController) {}

  ngOnInit() {
  this.dataService.getAllCities().subscribe(data => {
  this.allCities = data;
  console.log(this.allCities);
  });
  this.dataService.getCategories().subscribe((data: any) => {
  this.categories = data;
  console.log(this.categories);
  });

}

  selectCity(event:any){
    this.dataService.getAllAreas(event.target.value).subscribe((data) => {
      this.allAreas = data;
      console.log(this.allAreas);
    });
  }
  categoriesById(event:any){
    this.dataService.getSubCategoriesByCategories(event.target.value).subscribe((data) => {
      this.subCategories = data;
      console.log(this.subCategories);
    });
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
        console.log("Selected file (Base64):", file.type);
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
        console.log("Selected file (Base64):", file.type);
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
        console.log("Selected file (Base64):", file.type);
      };
      reader.readAsDataURL(file);
    }
  }

  async uploadImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos, 
    });
     if (image) {
      const base64String:any = 'data:image/jpeg;base64,' + image.base64String;
      this.addService.photoURL = base64String; 
       this.uploadFile = image;

     }
  }
  private async showLoading() : Promise<void> {
      const loading = await this.loadingController.create({
        message: 'Please wait...',
        duration: 10000,
        spinner: 'bubbles'
      });
      await loading.present();
  }
  async setup() {
    this.showLoading();
    this.dataService.getUsersProviders().subscribe(res=>{
    this.srNo = res.length + 1;
    })
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        this.addService.email,
        this.addService.password
      );
      const user = userCredential.user;
      if (user) {
        const userDocRef = doc(this.db, 'provider', user.uid);

        const path1 = `uploads/${user.uid}/${this.doc1Type == 'application/pdf' ? 'kycDoc1.pdf' : 'kycDoc1.png'}`;
        const storageRef1 = ref(this.storage, path1);
        await uploadString(storageRef1, this.addService.kycDoc1, 'base64');
        const doc1 = await getDownloadURL(storageRef1);

        const path2 = `uploads/${user.uid}/${this.doc2Type == 'application/pdf' ? 'kycDoc2.pdf' : 'kycDoc2.png'}`;
        const storageRef2 = ref(this.storage, path2);
        await uploadString(storageRef2, this.addService.kycDoc2, 'base64');
        const doc2 = await getDownloadURL(storageRef2);

        const path3 = `uploads/${user.uid}/${this.doc3Type == 'application/pdf' ? 'kycDoc3.pdf' : 'kycDoc3.png'}`;
        const storageRef3 = ref(this.storage, path3);
        await uploadString(storageRef3, this.addService.kycDoc3, 'base64');
        const doc3 = await getDownloadURL(storageRef3);
      
        await setDoc(userDocRef, { 
          SrNo: 'SHKP00'+this.srNo,
          name: this.addService.name,
          address: this.addService.address,
          mobile: this.addService.mobile,
          email: this.addService.email, 
          password: this.addService.password, 
          city: this.addService.city,
          area: this.addService.area,
          category: this.addService.category,
          subCategory: this.addService.subCategory,
          kycDoc1: doc1,
          kycDoc2: doc2,
          kycDoc3: doc3,
          photoURL:this.addService.photoURL,
          accountHolderName:this.addService.accountHolderName, 
          accountNumber: this.addService.accountNumber, 
          bankName:this.addService.bankName, 
          gst:this.addService.gst,
          status: 'received',
          dateOfApproval: '',
          renew: '',
          assignedJobsCount: 0, 
          customer: '', 
          rating: 0, 
          block: false,
          type: 'provider',
          isSuperAdmin: false,
          uid: user.uid
        });

        this.loadingController.dismiss();
        this.navCtrl.pop();
        console.log('Document written with ID: ', userDocRef.id);
        this.router.navigate(['/service-providers']);
      }
    } 
    catch (error) {
      this.loadingController.dismiss();
      console.error('Error registering user:', error);
    }
    this.loadingController.dismiss();
    this.navCtrl.pop();
    this.spin = false;
  }
}
