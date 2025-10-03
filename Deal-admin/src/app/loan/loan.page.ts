import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { deleteDoc, doc, getFirestore } from 'firebase/firestore';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.page.html',
  styleUrls: ['./loan.page.scss'],
})
export class LoanPage implements OnInit {
  public items: any[] = [];
  public db = getFirestore()
  public constructor(private data : DataService, private alertController: AlertController) {
    this.data.getLoanApplications().subscribe((application) => {
      this.items = application;
      console.log(this.items)
    })
   }

  public ngOnInit() :void {

  }

  public async deleteItemData(id:any):Promise<void>{
    let alert = await this.alertController.create({
      message: 'Are you sure to Delete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: async () => {
            await deleteDoc(doc(this.db, "loan", id));
          }
        }
      ]
    });
    alert.present();
  }

}
