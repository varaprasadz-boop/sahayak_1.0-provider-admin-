import { Component, OnInit } from '@angular/core';
import { Booking } from '../model/booking.model';
import { DataService } from '../services/data.service';
import { Category, Subcategory } from '../model/category';
import { AlertController, ModalController } from '@ionic/angular';
import { BookingDetailComponent } from '../booking-detail/booking-detail.component';
import { Router } from '@angular/router';
import { User } from '../model/user';
import { collection, doc, getDocs, getFirestore, increment, query, updateDoc, where } from 'firebase/firestore';

@Component({
  selector: 'app-book-now',
  templateUrl: './book-now.page.html',
  styleUrls: ['./book-now.page.scss'],
})
export class BookNowPage implements OnInit {
  public isApproved: boolean = true;
  public selectedBooking:any;
  public overAllBookings:any=[]
  public isProviderAvailable: boolean = false;
  private db = getFirestore();
  public bookings: Booking[];
  private providers: User[] = [];
  public filteredBookings: Booking[];
  public categories: Category[];
  public currentSegment: string = 'upcoming';
  public subCategories: Subcategory[] = [];
  public customers: User[] = [];
  public constructor(
    private data: DataService,
    private modalController: ModalController,
    public router: Router,
    private alertController: AlertController
  ) {}

  public ngOnInit(): void {
    this.getAllBookings();
    this.getOverAllBookings()
    this.getAllProviders()
    this.data.getCategories().subscribe((data) => {
      if (data != null) {
        this.categories = data;
      } else {
      }
    });
    this.data.getSubCategoriesList().subscribe((data) => {
      if (data != null) {
        this.subCategories = data;
      } else {
      }
    });
    this.data.getCustomersList().subscribe((data) => {
      if (data != null) {
        this.customers = data;
      } else {
        console.log('No data');
      }
    });
  }
  public getCustomerName(customer): string {
    for (let item of this.customers) {
      if (item.id == customer) {
        return item.displayName;
      }
    }
  }
  public segmentChanged(event: any): void {
    this.currentSegment = event.detail.value;
    this.filterBookings();
  }
  public getAllBookings(): void {
    this.data.getBookings(localStorage.getItem('providerUid')).subscribe((res) => {
      this.bookings = res.sort(this.compareDates);
      console.log(this.bookings);
      this.filterBookings();
    });
  }
 public getOverAllBookings(){
  this.data.getAllBookings().subscribe(res=>{
    this.overAllBookings = res 
    console.log(this.overAllBookings); 
  })
 }

 public getAllProviders(): any {
  this.providers = [];
  this.data.getAllProviders().subscribe(
    (res: any) => {
      if (Array.isArray(res)) {
        res.forEach((item) => {
          if (
            this.selectedBooking?.service?.id && // Ensure service and id exist
            Array.isArray(item.services) &&
            item.services.includes(this.selectedBooking.service.id)
          ) {
            this.providers.push(item);
            console.log('Matching Provider:', this.providers);
          }
        });
      } else {
        console.error('Response is not an array:', res);
      }
    },
    (error) => {
      console.error('Error fetching providers:', error);
    }
  );
}

  public compareDates(a: any, b: any): number {
    // Compare dates first
    const dateA = new Date(a.schedule.date);
    const dateB = new Date(b.schedule.date);

    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;

    // If dates are equal, compare times
    const timeA = a.schedule.time;
    const timeB = b.schedule.time;

    if (timeA < timeB) return -1;
    if (timeA > timeB) return 1;

    return 0;
  }
  public filterBookings(): void {
    if (this.currentSegment === 'upcoming') {
      this.filteredBookings = this.bookings.filter(
        (booking) =>
          booking.jobStatus !== 'completed' &&
          booking.jobStatus !== 'pending' &&
          (booking.agentAcceptedStatus === 'pending' || booking.agentAcceptedStatus === 'accepted' || (booking.agentAcceptedStatus === 'rejected' && booking.agentWhoRejected !== localStorage.getItem('providerUid') as string))
      );
    } else {
      this.filteredBookings = this.bookings.filter(
        (booking) => booking.jobStatus === 'completed'
      );
      console.log(this.filteredBookings);
    }
  }
  public categoryName(id): string {
    const category = this.categories.find((item) => item.id === id);
    return category ? category.name : '';
  }
  public async bookingDetail(booking): Promise<void> {
    const modal = await this.modalController.create({
      component: BookingDetailComponent,
      componentProps: {
        booking: booking,
      },
    });
    await modal.present();
  }
  toggleApproved() {
    this.isApproved = !this.isApproved;
  }
  bookingView(item: any) {
    this.router.navigate(['/booking-view'], { state: { data: item } });
  }
  getCategory(category) {
    for (let item of this.categories) {
      if (item.id === category) {
        return item.name;
      }
    }
  }
  getSubCategory(subcategory) {
    for (let item of this.subCategories) {
      if (item.id === subcategory) {
        return item.name;
      }
    }
  }
  public convertTo12HourFormat(time: string): string {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const adjustedHour = hourNum % 12 || 12;
    return `${adjustedHour}:${minute.padStart(2, '0')} ${ampm}`;
  }

 

  public async rejectBooking(booking: any, value: any): Promise<void> {
    this.selectedBooking = booking;
    if (value) {
        await this.handleProviderRejection(); // Call to handle provider rejection
    } else {
        await this.presentAlertConfirm(booking);
    }
}
private async handleProviderRejection(): Promise<void> {
  try {
      // Set booking status to rejected and reassign
      await this.updateBookingStatus('rejected');

      // Attempt to reassign the booking
      await this.checkProviderAvailability();
  } catch (error) {
      console.error("Error handling provider rejection:", error);
  }
}
private async updateBookingStatus(status: string): Promise<void> {
  const bookingRef = doc(this.db, 'bookings', this.selectedBooking.id);
  await updateDoc(bookingRef, {
      agentAcceptedStatus: status,
      jobStatus: status === 'rejected' ? 'pending' : this.selectedBooking.jobStatus,
      agentId: '',
      agentName: '',
      agentStatus: status === 'rejected' ? 'pending' : this.selectedBooking.agentStatus,
  });
}
private async checkProviderAvailability(): Promise<void> {
  if (Array.isArray(this.overAllBookings) && Array.isArray(this.providers)) {
      // Find available providers
      console.log(this.providers)
      const availableProviders:any = this.providers.filter((provider: any) => {
          return (
              provider.address.city === this.selectedBooking.address.city &&
              provider.address.area === this.selectedBooking.address.area &&
              provider.uid !== localStorage.getItem('providerUid') &&
              !this.overAllBookings.some((booking) => {
                  return (
                      booking.agentId === provider.uid &&
                      booking.schedule.date === this.selectedBooking.schedule.date &&
                      booking.schedule.time === this.selectedBooking.schedule.time
                  );
              })
          );
      });

      console.log('Available Providers:', availableProviders);

      if (availableProviders.length > 0) {
          try {
              const bookingRef = doc(this.db, 'bookings', this.selectedBooking.id);

              // Assign the first available provider
              await updateDoc(bookingRef, {
                  agentId: availableProviders[0].uid,
                  agentName: availableProviders[0].displayName,
                  agentStatus: 'assigned',
                  jobStatus: 'upcoming',
                  agentAcceptedStatus: 'pending',
                  hasAgentAccepted: true
              });

              console.log("Booking reassigned successfully to provider:", availableProviders[0]);
              this.isProviderAvailable = true;
          } catch (error) {
              console.error("Error updating booking with new provider:", error);
          }
      } else {
          console.log('No providers available for the selected date and time.');
          this.isProviderAvailable = false;
      }
  } else {
      console.error('Bookings or Providers are not arrays.');
  }
}

// private async checkProviderAvailability(): Promise<void> {
//     if (Array.isArray(this.overAllBookings) && Array.isArray(this.providers)) {
//         // Find available providers
//         const availableProviders = this.providers.filter((provider: any) => {
//             return (
//                 provider.address.city === this.selectedBooking.address.city &&
//                 provider.address.area === this.selectedBooking.address.area &&
//                 provider.uid !== localStorage.getItem('providerUid') &&
//                 !this.overAllBookings.some((booking) => {
//                     return (
//                         booking.agentId === provider.id &&
//                         booking.schedule.date === this.selectedBooking.schedule.date &&
//                         booking.schedule.time === this.selectedBooking.schedule.time
//                     );
//                 })
//             );
//         });

//         console.log('Available Providers:', availableProviders);
//         if (availableProviders.length > 0) {
//             try {
//                 const bookingRef = doc(this.db, 'bookings', this.selectedBooking.id);
                
//                 // Assign the first available provider
//                 await updateDoc(bookingRef, {
//                     agentId: availableProviders[0].id,
//                     agentName: availableProviders[0].displayName,
//                     agentStatus: 'assigned',
//                     jobStatus: 'upcoming',
//                     agentAcceptedStatus: 'pending',
//                     hasAgentAccepted: true // Ensure to set this to true if booking is assigned
//                 });

//                 console.log("Booking reassigned successfully to provider:", availableProviders[0]);
//                 this.isProviderAvailable = true;

//             } catch (error) {
//                 console.error("Error handling rejected booking:", error);
//             }
//         } else {
//             try {
//                 const bookingRef = doc(this.db, 'bookings', this.selectedBooking.id);
                
//                 // Update booking to indicate no available providers
//                 await updateDoc(bookingRef, {
//                     hasAgentAccepted: false,
//                     agentAcceptedStatus: 'rejected',
//                 });
                
//                 console.log('No providers available for the selected date and time.');
//                 this.isProviderAvailable = false;
//             } catch (error) {
//                 console.error("Error handling rejected booking:", error);
//             }
//         }
//     } else {
//         console.error('Bookings or Providers are not arrays.');
//     }
// }

// You might want to call this method to handle rejection from a provider
// private async handleProviderRejection(providerId: string): Promise<void> {
//     // Find and reassign booking if the current provider rejects it
//     await this.checkProviderAvailability();
// }



  
  public acceptBooking(booking, value:boolean): void {
    if (value) {
      const bookingRef = doc(this.db, 'bookings', booking.id);
      updateDoc(bookingRef, {
        hasAgentAccepted: true,
        agentAcceptedStatus: 'accepted',
      });
    }
    else {
      this.presentAlertConfirm(booking);
    }

  }
  async presentAlertConfirm(booking: Booking) {
    const alert = await this.alertController.create({
        header: 'Confirm Cancel',
        message: 'Are you sure you want to cancel this booking?',
        buttons: [
            {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {
                    console.log('Cancel booking action.');
                }
            }, {
                text: 'Reject',
                handler: async () => {
                    await this.handleProviderRejection(); // Ensure this is called
                }
            }
        ]
    });

    await alert.present();
}
}
