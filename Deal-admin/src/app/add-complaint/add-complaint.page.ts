import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonModal, ModalController, NavController, ToastController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-complaint',
  templateUrl: './add-complaint.page.html',
  styleUrls: ['./add-complaint.page.scss'],
})
export class AddComplaintPage implements OnInit {
  @ViewChild('modal') public modal: IonModal;
  public db = getFirestore()
  public searchValue: string = '';
  public isModalConfirmButton = false;
  public serviceProvider = [];
  public complaints: any = [];
  public allBooking: any = [];
  public storeBookingDetails: any;
  public addComplaint: any = {id:'', bookingId: '', customerName: '', complaintRaisedDate: '', agentName: '', complaintDetails: '' }
  public bookingId: any = [{ bookingId: 1 }, { bookingId: 2 }, { bookingId: 3 }, { bookingId: 4 }, { bookingId: 5 }]
  public customerName: any = [];
  public bookings: any[];
  public customAlertOptions = {
    backdropDismiss: false
  };
  constructor(public toastCtrl: ToastController,
    public dataService: DataService,
    public alertCtrl: AlertController,
    public navCtrl: NavController,private alertController: AlertController,public router:Router) {
    this.addComplaint.agentName = localStorage.getItem('adminName');
    this.addComplaint.agentName = JSON.parse(this.addComplaint.agentName);
    console.log(this.addComplaint.agentName);
  }
  ngOnInit() {
    this.dataService.getUsers().subscribe((data) => {
      if (data != null) {
        this.customerName = data;
        console.log(this.customerName);

      } else {
        console.log('no data found');
      }
    });
    this.getAllBookings();
    this.getServiceProvider();
  }
  public getAllBookings() {
    this.dataService.getAllBookings().subscribe(data => {
      this.allBooking = data;
      console.log(this.allBooking)
    })
  }

  public getServiceProvider() {
    this.dataService.getUsersProviders().subscribe((users) => {
      this.serviceProvider = users;
      console.log(this.serviceProvider);
    });
  }

  public getCustomerName(): void {
    this.customerName.forEach(element => {
      if (element.id == this.addComplaint.customerId) {
        this.addComplaint.customerName = element.displayName;
        console.log(this.addComplaint.customerName);
      }
    });
    this.dataService.getBookingsByUser(this.addComplaint.customerId).subscribe((data) => {
      if (data != null) {
        this.bookings = data;
        console.log(this.bookings);

      } else {
        console.log('no data found');
      }
    })
  }
  public async submit() {
    console.log(this.addComplaint);
    this.presentAlert();
  }
  async presentAlert() {
    let complaintId =0;
             this.dataService.getAllComplaint().subscribe(c => {
              complaintId = c.length +1;
              console.log(complaintId);
            });
    const alert = await this.alertController.create({
      header: 'Are you sure!',
      subHeader: 'Do you want to Submit the Complaint', 
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // this.alertController.dismiss()
            // location.reload();
          },
        },
        {
          text: 'YES',
          role: 'submit',
          handler: async () => {
            console.log(complaintId)
            try {
              const data = {
                complaintId: 'SHKC00'+complaintId,
                agentId: localStorage.getItem("uid"),
                srNo:this.storeBookingDetails.bookingId,
                bookingId: this.storeBookingDetails.id,
                customerId: this.storeBookingDetails.uid,
                providerId: this.storeBookingDetails.agentId,
                customerName: this.getCustomerNameStore(this.storeBookingDetails.uid),
                agentName: JSON.parse(localStorage.getItem("adminName")),
                complaintDetail: this.addComplaint.complaintDetails,
                status: 'open',
                created_at: new Date()
              }
              console.log(data)
              const docRef = await addDoc(collection(this.db, "complaints"),data );
              console.log(docRef);
              this.router.navigate(['/complaint'])
              return true;
            }
            catch (e) {
              return null;
            }
          },
        },
      ],
    });

    await alert.present();
  }
  clickItem(item: any) {
    this.storeBookingDetails = ''
    this.allBooking.forEach(booking => booking.checked = false);
    item.checked = true;
    this.storeBookingDetails = item;
    console.log(this.storeBookingDetails);
  }

  confirmButton() {
    this.modal.dismiss()
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

}
