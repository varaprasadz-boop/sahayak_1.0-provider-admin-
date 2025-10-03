import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-view-detail',
  templateUrl: './view-detail.page.html',
  styleUrls: ['./view-detail.page.scss'],
})
export class ViewDetailPage implements OnInit {
 public userDetailById:any;
  constructor(public router:Router,public dataService:DataService,private alertController: AlertController, public auth: AuthService,) { }

  ngOnInit() {
  }
  onClick(){
  let user:any=localStorage.getItem('providerUid')
  this.dataService.getUserById(user).subscribe(res=>{
  this.userDetailById=res; 
  console.log(this.userDetailById);
  if(this.userDetailById.status=='approved'){
    this.router.navigateByUrl('/tabs/home', {replaceUrl:true });
  }else{
   this.presentAlert();
  }
}) 
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Please Wait...',
      subHeader: 'Your Request has been Send Successfully',
      buttons: [ 
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.router.navigateByUrl('/view-detail', {replaceUrl:true });
          },
        },
      ],
    });

    await alert.present();
  }

  logout(){
    this.auth.logout();
    localStorage.removeItem('uid');
    localStorage.removeItem('isProviderLoggedIn');
    localStorage.clear();
    this.router.navigateByUrl('/login', { skipLocationChange: true, replaceUrl: true });
  }
  public async openTermsCondition() :Promise<void> {
    this.router.navigate(['/term-and-condition']);
  }
}
