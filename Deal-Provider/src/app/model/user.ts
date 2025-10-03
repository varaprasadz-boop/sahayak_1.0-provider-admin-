export class User {
    id: string;
    phoneNumber: string;
    photoURL: string;
    email: string;
    account: string;
    following: Following[];
    followers: Followers[];
    wishlist: Wishlist[];
    displayName: string;
    online: boolean;
    block: boolean;
    type: string;
    lastSeen: number;  
    typing: boolean;
    fcm_token: string;
    businessName: string;
    businessAddress: string;
    businessGST: string;
  name: any;
  status?: string;
}

export class Following {}

export class Followers {}

export class Wishlist {}