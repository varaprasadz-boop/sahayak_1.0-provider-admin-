// src/app/services/booking.service.ts
import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { User } from '../model/user';
import { Booking } from '../model/booking.model';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private db = getFirestore();

  constructor(private data: DataService) {}

  public getAllProviders(serviceId: string): Observable<User[]> {
    return this.data.getAllProviders().pipe(
      map((res: any[]) => {
        if (Array.isArray(res)) {
          return res.filter(item =>
            Array.isArray(item.services) && item.services.includes(serviceId)
          );
        } else {
          console.error('Response is not an array:', res);
          return [];
        }
      }),
      catchError(error => {
        console.error('Error fetching providers:', error);
        return of([]);
      })
    );
  }

  public checkProviderAvailability(selectedBooking: Booking, providers: any[], allBookings: Booking[]): Observable<User[]> {
    return of(providers.filter((provider:any) => {
      return (
        provider.address.city === selectedBooking.address.city &&
        provider.address.area === selectedBooking.address.area &&
        provider.uid !== localStorage.getItem('providerUid') &&
        !allBookings.some(booking => {
          return (
            booking.agentId === provider.uid &&
            booking.schedule.date === selectedBooking.schedule.date &&
            booking.schedule.time === selectedBooking.schedule.time
          );
        })
      );
    }));
  }

  public async updateBookingStatus(bookingId: string, status: string): Promise<void> {
    const bookingRef = doc(this.db, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      agentAcceptedStatus: status,
      jobStatus: status === 'rejected' ? 'pending' : '',
      agentId: '',
      agentName: '',
      agentStatus: status === 'rejected' ? 'pending' : ''
    });
  }

  public async handleProviderRejection(selectedBooking: Booking, allBookings: Booking[], providers: any[]): Promise<void> {
    try {
      await this.updateBookingStatus(selectedBooking.id, 'rejected');
      const availableProviders:any = await this.checkProviderAvailability(selectedBooking, providers, allBookings).toPromise();
      if (availableProviders.length > 0) {
        const bookingRef = doc(this.db, 'bookings', selectedBooking.id);
        await updateDoc(bookingRef, {
          agentId: availableProviders[0].uid,
          agentName: availableProviders[0].displayName,
          agentStatus: 'assigned',
          jobStatus: 'upcoming',
          agentAcceptedStatus: 'pending',
          hasAgentAccepted: true
        });
      } else {
        console.log('No providers available for the selected date and time.');
      }
    } catch (error) {
      console.error('Error handling provider rejection:', error);
    }
  }
}
