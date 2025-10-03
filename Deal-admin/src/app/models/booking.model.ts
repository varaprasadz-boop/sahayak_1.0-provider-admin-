import { Timestamp } from 'firebase/firestore';
import { Service } from './services';
export interface Booking {
  id?: string;
  bookingId?: string;
  uid: string;
  service: Service;
  rating?: string;
  isRated:string;
  schedule: Schedule;
  address: Address;
  agentId: string;
  agentName: string;
  agentPaymentStatus: string;
  paymentStatus: string;
  paymentDate: Date;
  date: string;
  transferID: string;
  transferMode: string;
  bookingStatus: string;
  agentStatus: string;
  jobStatus: string;
  paymentType: string;
  total: number;
  completed?: boolean;
  completed_at?: any;
  customerRefundStatus: string;
  cusstomerRefundPaid: string;
  customerRefundtransferID: string;
  customerRefundtransferMode: string;
  customerRefundpaymentDate: string;
}
export interface Address {
  id?: string;
  uid: string;
  name: string;
  address: string;
  phone: string;
  city: string;
  area: string;
  cityName: string;
  areaName: string;
  location: string;
  landmark?: string;
  pincode: string;
  checked?: boolean;
  latitude: number;
  longitude: number;
  locality: string;
}
export interface Schedule {
  date: string;
  time: string;
}
