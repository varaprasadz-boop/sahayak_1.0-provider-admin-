import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
@Component({
  selector: 'app-apply-loan',
  templateUrl: './apply-loan.page.html',
  styleUrls: ['./apply-loan.page.scss'],
})
export class ApplyLoanPage implements OnInit {
  public applyForLoan:any={loanFor:'', name:'',phone:'',brand:'',model:'',manufacturing:'',loan:'',panNo:'',applyDate:new Date()};
  public db = getFirestore();
  public constructor(private alertController: AlertController,public router:Router) { }

  public ngOnInit():void {
  }
  
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Your Application Submitted Successfully!',
      buttons:[
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.router.navigate(['/tabs/home']);
          this.applyForLoan={loanFor:'',name:'',phone:'',brand:'',model:'',manufacturing:'',loan:'',panNo:'',applyDate:new Date()}
          },
        },
      ],
    });
    await alert.present();
  }

  public async submit() :Promise<void> {
    const docRef = await addDoc(collection(this.db, "loan"), this.applyForLoan);
    console.log("Document written with ID: ", docRef.id);
    this.presentAlert();
  }
}
