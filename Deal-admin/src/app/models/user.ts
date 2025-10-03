export class User {
    uid?: string;
    id: string;
    phoneNumber: string;
    photoURL: string;
    email: string;
    account: string;
    block: string;
    type: string;
    following: Following[];
    followers: Followers[];
    wishlist: Wishlist[];
    displayName: string;
    online: boolean;
    lastSeen: number;
    typing: boolean;
    fcm_token: string;
    businessName:string;
    businessGST:string;
    businessAddress:string;
    accountNumber?:string;
    ifscCode?:string;
    accountHolderName?:string;
    bankName?:string;
    transferID?:string;
    location?:string;
    landmark?:string;
    name?:string;
}

export class Following {}

export class Followers {}

export class Wishlist {}