import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { DataService } from '../services/data.service';
import { ModalController, ViewDidEnter } from '@ionic/angular';
import { parse, formatISO } from 'date-fns';
import { BookingDetailsComponent } from '../components/booking-details/booking-details.component';

@Component({
  selector: 'app-calander',
  templateUrl: './calander.page.html',
  styleUrls: ['./calander.page.scss'],
})
export class CalanderPage implements OnInit, ViewDidEnter {
  public serviceProviders: any = [];
  public categories: any = [];
  public subCategories: any = [];
  public bookings: any = [];
  public cities: any = [];
  public areas: any = [];
  public filter = {
    agent: '',
    category: '',
    subcategory: '',
    city: '',
    area: '',
  };
  public calendarOptions: CalendarOptions = {
    initialView: 'timeGridDay',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'timeGridDay,timeGridWeek', // user can switch between the two
    },
    slotMinTime: '7:00:00',
    slotMaxTime: '21:00:00',
    expandRows: true,
    eventClick: (info: any) => this.bookingDetails(info),
  };
  public constructor(
    private data: DataService,
    private modalController: ModalController
  ) {}

  public ngOnInit(): void {}

  public ionViewDidEnter(): void {
    this.data.getUsersProviders().subscribe((data) => {
      if (data != null) {
        this.serviceProviders = data;
        console.log(this.serviceProviders)
      } else {
        console.log('no data found');
      }
    });
    this.data.getCategories().subscribe((data) => {
      if (data != null) {
        this.categories = data;
      } else {
        console.log('no data found');
      }
    });
    this.data.getAllBookings().subscribe((data) => {
      if (data != null) {
        this.bookings = data;
        console.log(this.bookings);
        const updatedBookings = this.bookings.map((booking) => {
          return {
            ...booking,
            id: booking.id,
            title: booking.service.name,
            start: this.convertToISO(
              booking.schedule.date,
              booking.schedule.time
            ),
            color: this.getColor(booking.jobStatus),
            backgroundColor: this.getColor(booking.jobStatus),
          };
        });
        console.log(updatedBookings);
        this.calendarOptions.events = updatedBookings;
      } else {
        console.log('no data found');
      }
    });
    this.data.getAllCities().subscribe((data) => {
      if (data != null) {
        this.cities = data;
      } else {
        console.log('no data found');
      }
    });
  }
  public resetFilter(): void {
    this.filter = {
      agent: '',
      category: '',
      subcategory: '',
      city: '',
      area: '',
    };
    this.data.getAllBookings().subscribe((data) => {
      if (data != null) {
        this.bookings = data;
        console.log(this.bookings);
        const updatedBookings = this.bookings.map((booking) => {
          return {
            ...booking,
            id: booking.id,
            title: booking.service.name,
            start: this.convertToISO(
              booking.schedule.date,
              booking.schedule.time
            ),
            color: this.getColor(booking.jobStatus),
            backgroundColor: this.getColor(booking.jobStatus),
          };
        });
        console.log(updatedBookings);
        this.calendarOptions.events = updatedBookings;
      } else {
        console.log('no data found');
      }
    });
  }
  public selectCategory(event: any): void {
    this.segmentChanged('category',event.target.value)
    this.data
      .getSubCategoriesByCategories(event.target.value)
      .subscribe((data) => {
        if (data != null) {
          this.subCategories = data;
          console.log(this.areas);
        } else {
          console.log('no data found');
        }
      });
  }
  public selectCity(event: any): void {
    this.segmentChanged('subcategory',event.target.value);
    this.data.getAllAreabyCity(event.target.value).subscribe((data) => {
      if (data != null) {
        this.areas = data;
        console.log(this.areas);
      } else {
        console.log('no data found');
      }
    });
  }
  public convertToISO(date, time): string {
    if (!date || !time) {
      return undefined; // Return undefined if date or time is not provided
    }

    // Combine date and time into a single string
    const dateTimeString = `${date} ${time}`;

    // Parse the date and time string into a Date object
    const parsedDate = parse(dateTimeString, 'yyyy-MM-dd HH:mm', new Date());

    // Convert the Date object to an ISO string
    return formatISO(parsedDate);
  }
  public bookingDetails(info: any) {
    let selectedBooking;
    if (this.bookings.length > 0) {
      // Find the selected booking from the list
      selectedBooking = this.bookings.find(
        (booking) => booking.id === info.event.id
      );
      if (selectedBooking) {
        // Open modal with selected booking details
        this.presentModal(selectedBooking);
      } else {
        console.error('Booking not found in the list');
      }
    } else {
      console.error('Bookings are not loaded');
    }
  }

  async presentModal(booking) {
    const modal = await this.modalController.create({
      component: BookingDetailsComponent,
      componentProps: {
        storeBookingDetails: booking,
      },
    });

    await modal.present();
  }
  public getColor(jobStatus): string {
    switch (jobStatus) {
      case 'completed':
        return '#69a982';
      case 'upcoming':
        return '#ffc409';
      case 'pending':
        return '#92949c';
    }
  }
  segmentChanged(event: any, id:any) {
    const selectedSegment = event;
    console.log(selectedSegment)
    // Clear existing filters
    this.filter = {
      agent: '',
      category: '',
      subcategory: '',
      city: '',
      area: '',
    };

    switch (selectedSegment) {
      case 'agent':
        this.filter.agent = id; // Replace 'selectedAgentId' with actual logic to get selected agent
        break;
      case 'category':
        this.filter.category = id; // Replace 'selectedCategoryId' with actual logic to get selected category
        break;
      case 'city':
        this.filter.city = id; // Replace 'selectedCityId' with actual logic to get selected city
        break;
      case 'area':
        this.filter.area = id; // Replace 'selectedAreaId' with actual logic to get selected area
        break;
      default:
        // Handle default case if needed
        break;
    }

    this.applyFilters();
  }

  applyFilters() {
    console.log(this.filter)
    // Inside your applyFilters() method or where appropriate
    // Example: Fetch filtered bookings based on this.filter
    const filteredBookings = this.bookings.filter((booking) => {
      return (
        (!this.filter.agent || booking.agentId === this.filter.agent) &&
        (!this.filter.category || booking.service.category === this.filter.category) &&
        (!this.filter.city || booking.address.city === this.filter.city) &&
        (!this.filter.area || booking.address.area === this.filter.area)
      );
    });
    console.log(filteredBookings)
    // Transform filtered bookings into calendar events format
    const updatedBookings = filteredBookings.map((booking) => {
      return {
        ...booking,
        id: booking.id,
        title: booking.service.name,
        start: this.convertToISO(booking.schedule.date, booking.schedule.time),
        color: this.getColor(booking.jobStatus),
        backgroundColor: this.getColor(booking.jobStatus),
      };
    });

    // Update calendar events
    this.calendarOptions.events = updatedBookings;
  }
}
