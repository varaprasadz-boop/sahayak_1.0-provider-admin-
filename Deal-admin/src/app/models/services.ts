export interface Service {
    id: string;
    category: string;
    subCategory: string;
    name: string;
    description: string;
    image: string;
    price: string;
    serviceProviderCharge:number;
    commission:number;
    transferID:string;
    status: string;
    created_at: Date;
}