import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { AlertController, isPlatform } from '@ionic/angular';
import { CommonService } from '../services/common.service';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.page.html',
  styleUrls: ['./complaint.page.scss'],
})
export class ComplaintPage implements OnInit {
  public db = getFirestore();
  public complaints: any = [];
  public bookings: any[] = [];
  public customerName: any = [];
  public serviceProvider = [];
  public selectedBookings: any;
  public offerComplaints: any;
  public viewComplaints: any;
  @ViewChild(IonModal) modal: IonModal;
  @ViewChild(IonModal) modal2: IonModal;
  @ViewChild(IonModal) modal3: IonModal;
  constructor(public dataService: DataService, private cs: CommonService, private alertController: AlertController) { }

  ngOnInit() {
    this.getAllComplaints();
    this.getAllBookings();
    this.getServiceProvider();
    this.dataService.getUsers().subscribe((data) => {
      if (data != null) {
        this.customerName = data;
        console.log(this.customerName);
      } else {
        console.log('no data found');
      }
    });
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }
  cancel2() {
    this.modal2.dismiss(null, 'cancel');
  }
  cancel3() {
    this.modal3.dismiss(null, 'cancel');
  }

  async confirm(offerComplaints) {
    this.modal.dismiss('confirm');
    const catRef = doc(this.db, 'complaints', offerComplaints.id);
    await updateDoc(catRef, {
      status: 'close',
      solutionOffered: offerComplaints.solutionOffered,
      closeDate: new Date()
    });
  }

  getAllComplaints() {
    this.dataService.getAllComplaint().subscribe(res => {
      this.complaints = res;
      console.log(this.complaints);
    })
  }
  getStatusColor(statusType: string, status: string): string {
    switch (statusType) {
      case 'status':
        switch (status) {
          case 'open': return 'danger';
          case 'close': return 'success';
          default: return '';
        }
      default:
        return '';
    }
  }
  statusChanged(item) {
    document.getElementById('open-modal').click()
    this.offerComplaints = item;
  }
  // async closeComplaint(item) {
  //   const alert = await this.alertController.create({
  //     header: 'Close Complaint!',
  //     inputs: [
  //       {
  //         name: 'solutionOffered',
  //         type: 'text',
  //         placeholder: 'Enter Solution Offered'
  //       }
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         handler: () => {
  //           console.log('Confirm Cancel: blah');
  //         }
  //       }, {
  //         text: 'Okay',
  //         handler: async (data) => {
  //           console.log('Confirm Okay', data.solutionOffered);
  //           const catRef = doc(this.db, 'complaints', item.id);
  //           await updateDoc(catRef, {
  //             status: 'close',
  //             solutionOffered : data.solutionOffered,
  //             closeDate : new Date()
  //           });
  //         }
  //       }
  //     ]
  //   });

  //   await alert.present();
  // }

  presentAlert3(item: any) {
    document.getElementById('open-modal3').click()
    this.viewComplaints = item;
  }
  presentAlert(item: any) {
    console.log(item);
    document.getElementById('open-modal2').click()
    this.viewComplaints = item.solutionOffered;
    // for(let i=0; i<this.bookings.length; i++) {
    // if(this.bookings[i].id == item.bookingId) {
    //   this.selectedBookings=this.bookings; 
    //   console.log(this.selectedBookings);
    //   }
    // }
    const selectedBooking = this.bookings.find(booking => booking.id === item.bookingId);
    this.selectedBookings = selectedBooking ? [selectedBooking] : [];
    console.log(this.selectedBookings);

  }
  public getAllBookings(): void {
    this.dataService.getAllBookings().subscribe((data) => {
      this.bookings = data;
      console.log(this.bookings);
    });
  }
  getCustomerNameStore(displayName) {
    for (let item of this.customerName) {
      if (item.id === displayName) {
        return item.displayName;
      }
    }
  }
  getServiceProviderNameStore(id) {
    for (let item of this.serviceProvider) {
      if (item.uid === id) {
        return item.name;
      }
    }
  }
  public getServiceProvider() {
    this.dataService.getUsersProviders().subscribe((users) => {
      this.serviceProvider = users;
      console.log(this.serviceProvider);
    });
  }
  public formatTimestamp(time: any): string {
    if (time === undefined) {
      return '';
    }
    const date = time.toDate();
    return date.toLocaleString();
  }
  
}
