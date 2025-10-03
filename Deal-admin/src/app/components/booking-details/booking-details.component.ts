import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss'],
})
export class BookingDetailsComponent implements OnInit {
  @Input() public storeBookingDetails;
  public allBooking:any[]=[];
  public customers:any[]=[];
  public serviceProvider:any[]=[];
  constructor(public dataService : DataService, public modalController: ModalController) { }

  ngOnInit() {
    this.dataService.getUsers().subscribe((data) => {
      if (data != null) {
        this.customers = data;
        console.log(this.customers);
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
    this.dataService.getUsersProviders().subscribe((serviceProvider) => {
    this.serviceProvider = serviceProvider;
    });
  }
  getServiceProviderNameStore(id) {
    for (let item of this.serviceProvider) {
      if (item.uid === id) {
        return item.name;
      }
    }
  }
  getCustomerNameStore(displayName) {
    for (let item of this.customers) {
      if (item.id === displayName) {
        return item.displayName;
      }
    }
  }
  async updateStatus(event, id) {
    const firestore = getFirestore();
    const catRef = doc(firestore, "bookings", id);
       await updateDoc(catRef, {
        jobStatus: event.detail.value
     });
  }
}
