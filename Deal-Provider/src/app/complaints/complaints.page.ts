import { Component, OnInit } from '@angular/core';
import { getFirestore } from 'firebase/firestore';
import { DataService } from '../services/data.service';
import { Complaints } from '../model/complaints.model';
import { ModalController } from '@ionic/angular';
import { ComplaintDetailPage } from '../complaint-detail/complaint-detail.page';

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.page.html',
  styleUrls: ['./complaints.page.scss'],
})
export class ComplaintsPage implements OnInit {
  public complaints : Complaints[] = [];
  public db = getFirestore();
  public constructor(private data : DataService, private modalCtrl: ModalController) { }

  public ngOnInit() : void {
    this.getComplaints();
  }
  public getComplaints() : void {
    this.data.getComplaints(localStorage.getItem('providerUid')).subscribe((data) => {
      this.complaints = data;
    });
  }
  public async viewComplaints(item : Complaints) : Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ComplaintDetailPage,
      componentProps: {
        complaint: item
      }
    });
    return await modal.present();
  }
}
