import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { 
    Firestore, 
    collection, 
    doc, docData, 
    addDoc, updateDoc, 
    collectionData, 
    where, query, 
    limitToLast, 
    orderBy, 
    docSnapshots, 
    limit,
    getDoc} from '@angular/fire/firestore';
import { Category, Subcategory } from '../model/category';
import { User } from '../model/user';
import { Package } from '../model/package';
import { Item } from '../model/item';
import { Chat, ChatHistory } from '../model/chat';
import { Notification } from '../model/notification';
import { Service } from '../model/services';
import { Address } from 'cluster';
import { Booking } from '../model/booking.model';
import { Content } from '../model/content.model';
import { Complaints } from '../model/complaints.model';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private firestore: Firestore, 
    public http: HttpClient
    ) {}

  //Get categories 
  getCategories(): Observable<Category[]>{
    const categoryCollection = collection(this.firestore, 'categories');
    const queryList = query(categoryCollection, where('status', '==', 'active'));
    return collectionData( queryList, {idField: 'id'}) as Observable<Category[]>;
  }

  //Get subcategories 
  getSubCategories(id): Observable<Subcategory[]>{
    const categoryCollection = collection(this.firestore, 'sub-categories');
    const queryList = query(categoryCollection, where('category', '==', id), where('status','==','active'));
    return collectionData(queryList, {idField: 'id'}) as Observable<Subcategory[]>;
  }

  getSubCategoriesList(): Observable<Subcategory[]>{
    const categoryCollection = collection(this.firestore, 'sub-categories');
    const queryList = query(categoryCollection, where('status', '==', 'active'));
    return collectionData(queryList, {idField: 'id'}) as Observable<Subcategory[]>;
  }

  //Get subcategories 
  getPackages(): Observable<Package[]>{
    const categoryCollection = collection(this.firestore, 'packages');
    const queryList = query(categoryCollection);
    return collectionData(queryList, {idField: 'id'}) as Observable<Package[]>;
  }

  getmyItems(id): Observable<Item[]>{
    const categoryCollection = collection(this.firestore, 'items');
    const queryList = query(categoryCollection, where('userId', '==', id));
    return collectionData(queryList, {idField: 'id'}) as Observable<Item[]>;
  }

  getNote(): Observable<Notification[]>{
    const categoryCollection = collection(this.firestore, 'notifications');
    return collectionData(categoryCollection, {idField: 'id'}) as Observable<Notification[]>;
  }

  getItems(id): Observable<Service[]>{
    const categoryCollection = collection(this.firestore, 'services');
    const queryList = query(categoryCollection, where('subCategory', '==', id), where('status', '==', 'active'));
    return collectionData(queryList, {idField: 'id'}) as Observable<Service[]>;
  }
  getServices(): Observable<Service[]>{
    const categoryCollection = collection(this.firestore, 'services');
    const queryList = query(categoryCollection, where('status', '==', 'active'));
    return collectionData(queryList, {idField: 'id'}) as Observable<Service[]>;
  }
  getItemsFilter(catid, id): Observable<Service[]>{
    const categoryCollection = collection(this.firestore, 'services');
    const queryList = query(categoryCollection, where('category', '==', catid), where('subCategory', '==', id), where('status', '==', 'active'));
    return collectionData(queryList, {idField: 'id'}) as Observable<Service[]>;
  }

  getUsers(): Observable<User[]>{
    const userCollection = collection(this.firestore, 'provider');
    return collectionData(userCollection, {idField: 'id'}) as Observable<User[]>;
  }
  getUserspeople(): Observable<User[]>{
    const categoryCollection = collection(this.firestore, 'users');
    const queryList = query(categoryCollection, where('type', '==', 'users'));
    return collectionData(queryList, {idField: 'id'}) as Observable<User[]>;
  }
  getUsersList(): Observable<User[]>{
    const userCollection = collection(this.firestore, 'users');
    return collectionData(userCollection, {idField: 'id'}) as Observable<User[]>;
  }
  getAllItems(): Observable<Service[]>{
    const userCollection = collection(this.firestore, 'services');
    return collectionData(userCollection, {idField: 'id'}) as Observable<Service[]>;
  }


  //Get user by Id
  getUserById(id: string): Observable<User> {
    const document = doc(this.firestore, `provider/${id}`);
    return docSnapshots(document)
    .pipe(
      map(doc => {
        const id = doc.id;
        const data = doc.data();
        return { id, ...data } as User
      })
    );
  }
  async getUserByIdss(id: string): Promise<User> {
    const document = doc(this.firestore, `provider/${id}`);
    const docSnap = await getDoc(document);
  
    if (docSnap.exists()) {
      const data = docSnap.data();
      return { id: docSnap.id, ...data } as User;
    } else {
      throw new Error('No such document!');
    }
  }
  getUsersById(id: string): Observable<User> {
    const document = doc(this.firestore, `users/${id}`);
    return docSnapshots(document)
    .pipe(
      map(doc => {
        const id = doc.id;
        const data = doc.data();
        return { id, ...data } as User
      })
    );
  }
  getChats(chatId): Observable<Chat[]>{
    //query(citiesRef, orderBy("name"), limit(3));
    const chatsCollection = collection(this.firestore, 'chatroom', chatId, chatId);
    const queryList = query(chatsCollection, orderBy('timestamp'));
    return collectionData(queryList, {idField: 'id'})
    .pipe(
      map(chats => chats as Chat[])
    );
  }

  getChatsHistory(userId): Observable<ChatHistory[]>{
    //query(citiesRef, orderBy("name"), limit(3));
    const chatsCollection = collection(this.firestore, 'provider', userId, 'chatlist');
    const queryList = query(chatsCollection, orderBy('timestamp'));
    return collectionData(queryList, {idField: 'id'})
    .pipe(
      map(chats => chats as ChatHistory[])
    );
  } 

  getNewItemList(): Observable<Service[]> {
    const postCollection = collection(this.firestore, 'services');
    const queryList = query(postCollection,
      where("status", "==", "active"),  // Filter by adStatus equals 'approved'
      orderBy("created_at", "asc"),
      limit(20));
    return collectionData(queryList, { idField: 'id' }) as Observable<Service[]>;
    
  }

  getAllProviders(): Observable<User[]>{
    const categoryCollection = collection(this.firestore, 'provider');
    const queryList = query(categoryCollection, where('block', '==', false), where('status', '==', 'approved'));
    return collectionData(queryList, {idField: 'id'}) as Observable<User[]>;
  }
  getChatById(id: string, chatId): Observable<ChatHistory> {
    const document = doc(this.firestore, `provider/${id}`, 'chatlist', chatId);
    return docSnapshots(document)
    .pipe(
      map(doc => {
         const id = doc.id;
        const data = doc.data();
        return { id, ...data } as ChatHistory;
      })
    );
  }

  getItemById(id: string): Observable<Booking> {
    const document = doc(this.firestore, `bookings/${id}`);
    return docSnapshots(document)
    .pipe(
      map(doc => {
        const id = doc.id;
        const data = doc.data();
        return { id, ...data } as Booking
      })
    );
  }
  getServiceById(ids: string): Observable<Service> {
    const document = doc(this.firestore, `services/${ids}`);
    return docSnapshots(document)
    .pipe(
      map(doc => {
        const id = doc.id;
        const data = doc.data();
        return { id, ...data } as Service
      })
    );
  }
  public getAllCities(): Observable<any> {
    const categoryCollection = collection(this.firestore, 'cities');
    const queryList = query(categoryCollection, orderBy('name', 'asc'));
    return collectionData(queryList, { idField: 'id' }) as Observable<any>;
  }
 
  getSubCategoriesByCategories(id): Observable<Subcategory[]>{
    const categoryCollection = collection(this.firestore, 'sub-categories');
    const queryList = query(categoryCollection, where('category', '==', id), where('status','==','active'));
    return collectionData(queryList, {idField: 'id'}) as Observable<Subcategory[]>;
  }
  public getAllAreas(cityId): Observable<any> {
    const categoryCollection = collection(this.firestore, 'cityarea');
    const queryList = query(categoryCollection, where('cityId', '==', cityId), orderBy('name', 'asc'));
    return collectionData(queryList, { idField: 'id' }) as Observable<any>;
  }
 
  public getAllPackages():Observable<any> {
    const categoryCollection = collection(this.firestore, 'packages');
    const queryList = query(categoryCollection, orderBy('cost', 'asc'));
    return collectionData(queryList, { idField: 'id' }) as Observable<any>;
  }
  getaddresses(uid): Observable<Address[]>{
    const categoryCollection = collection(this.firestore, 'addresses');
    const queryList = query(categoryCollection, where('uid', '==', uid));
    return collectionData(queryList, {idField: 'id'}) as Observable<Address[]>;
  }
  getBookings(uid: string): Observable<Booking[]> {
    const categoryCollection = collection(this.firestore, 'bookings');
    const queryList = query(
      categoryCollection,
      where('agentId', '==', uid),
      orderBy('schedule.date', 'desc')
    );
    return collectionData(queryList, { idField: 'id' }) as Observable<Booking[]>;
  }
  getComplaints(uid): Observable<Complaints[]>{
    const categoryCollection = collection(this.firestore, 'complaints');
    const queryList = query(categoryCollection, where('customerId', '==', uid));
    return collectionData(queryList, {idField: 'id'}) as Observable<Complaints[]>;
  }
  getAllBookings(): Observable<Booking[]>{
    const categoryCollection = collection(this.firestore, 'bookings');
    const queryList = query(categoryCollection , orderBy('schedule.date', 'desc'));
    return collectionData(queryList, {idField: 'id'}) as Observable<Booking[]>;
  }
  getAllBookingsByUid(uid: any, date: any): Observable<Booking[]> {
    const categoryCollection = collection(this.firestore, 'bookings');
    const queryList = query(
      categoryCollection, 
      where('agentId', '==', uid), 
      where('schedule.date', '==', date)
    );
    return collectionData(queryList, { idField: 'id' }) as Observable<Booking[]>;
  }
  
  getAllContent(): Observable<Content[]>{
    const categoryCollection = collection(this.firestore, 'content');
    const queryList = query(categoryCollection);
    return collectionData(queryList, {idField: 'id'}) as Observable<Content[]>;
  }
  getAllServiceProviders(): Observable<Package[]>{
    const categoryCollection = collection(this.firestore, 'provider');
    const queryList = query(categoryCollection);
    return collectionData(queryList, {idField: 'id'}) as Observable<Package[]>;
  }
  getAllContents(): Observable<any[]>{
    const categoryCollection = collection(this.firestore, 'content');
    const queryList = query(categoryCollection);
    return collectionData(queryList, {idField: 'id'}) as Observable<any[]>;
  }
  getEarningBookings(uid): Observable<Booking[]>{
    const categoryCollection = collection(this.firestore, 'bookings');
    const queryList = query(categoryCollection, where('jobStatus', '==', 'completed'), where('agentId', '==', uid));
    return collectionData(queryList, {idField: 'id'}) as Observable<Booking[]>;
  }
  getBookinDetailById(id: string): Observable<any> {
    const document = doc(this.firestore, `bookings/${id}`);
    return docSnapshots(document)
    .pipe(
      map(doc => {
        const id = doc.id;
        const data = doc.data();
        return { id, ...data } as any
      })
    );
  }
  getCustomersList(): Observable<User[]>{
    const categoryCollection = collection(this.firestore, 'users');
    const queryList = query(categoryCollection, where('type', '==', 'users'));
    return collectionData(queryList, {idField: 'id'}) as Observable<User[]>;
  }
   // get provider 
   getCustomerById(id: string): Observable<User> {
    console.log(id)
    const document = doc(this.firestore, `users/${id}`);
    return docSnapshots(document)
    .pipe(
      map(doc => {
        const id = doc.id;
        const data = doc.data();
        return { id, ...data } as User
      })
    );
  }
}
