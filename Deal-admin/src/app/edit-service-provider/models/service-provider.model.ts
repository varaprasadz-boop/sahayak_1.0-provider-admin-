export interface IProvider {
    status: string;
    kycDoc1: string;
    photoURL: string;
    email: string;
    area: string;
    address: string;
    uid?: string; // Made optional
    accountNumber?: string; // Made optional
    kycDoc2: string;
    city: string;
    SrNo: string;
    subCategory: string;
    gst?: string; // Made optional
    accountHolderName?: string; // Made optional
    rating: number;
    dateOfApproval: string;
    category: string;
    name: string;
    assignedJobsCount: number;
    block: boolean;
    type: string;
    customer: string;
    password: string;
    renew: string;
    isSuperAdmin: boolean;
    mobile: string;
    bankName?: string; // Made optional
    kycDoc3: string;
    id: string;
  }
  