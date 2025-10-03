import { Address } from "./address.model";
import { Schedule } from "./schedule.model";
import { Service } from "./services";

export interface Booking {
    id?: string;
    bookingId?: string;
    uid: string;
    service: Service;
    isRated?: boolean;
    rating?:number;
    schedule: Schedule;
    address: Address;
    agentId: string;
    agentName: string;
    paymentStatus: string;
    agentPaymentStatus?: string;
    serviceProviderCharge?: number;
    commission?: number;
    date: string;
    bookingStatus: string;
    agentStatus: string;
    jobStatus: string;
    paymentType: string;
    total: number;
    agentAcceptedStatus?: string;
    completed?: boolean;
    completedTime?:string;
    hasAgentAccepted?: boolean;
    agentWhoRejected?: string;
    completed_at?: string;
}