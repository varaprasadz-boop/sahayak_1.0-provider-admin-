export interface Complaints {
    id?:string;
    agentId:string;
    agentName:string;
    bookingId:string;
    complaintDetail:string;
    customerId:string;
    customerName:string;
    status:string;
    created_at?:string | any;
    closed_at?:string | any;
    closedBy?:string;
    solutionOffered?:string;
}