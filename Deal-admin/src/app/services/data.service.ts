import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {
  Firestore,
  collection,
  doc,
  docData,
  addDoc,
  updateDoc,
  collectionData,
  where,
  query,
  limitToLast,
  orderBy,
  docSnapshots,
  limit,
  deleteDoc,
  getCountFromServer,
  startAfter,
} from '@angular/fire/firestore';
import { Category, Subcategory } from '../models/category';
import { User } from '../models/user';
import { Item } from '../models/item';
import { Report } from '../models/report';
import { Photo } from '@capacitor/camera';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadString,
} from '@angular/fire/storage';
import { Service } from '../models/services';
import { SubAdmins } from '../models/subadmins.model';
import { Content } from '../models/content.model';
import { Booking } from '../models/booking.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  [x: string]: any;

  constructor(
    private firestore: Firestore,
    public http: HttpClient,
    private storage: Storage
  ) {}

  //Get categories
  getCategories(): Observable<Category[]> {
    const categoryCollection = collection(this.firestore, 'categories');
    return collectionData(categoryCollection, { idField: 'id' }) as Observable<
      Category[]
    >;
  }
  //Get subcategories
  getSubCategoriesList(): Observable<Subcategory[]> {
    const categoryCollection = collection(this.firestore, 'sub-categories');
    const queryList = query(
      categoryCollection,
      where('category', '==', 'active')
    );
    return collectionData(queryList, { idField: 'id' }) as Observable<
      Subcategory[]
    >;
  }

  getNotifications(): Observable<Notification[]> {
    const categoryCollection = collection(this.firestore, 'notifications');
    //const queryList = query(tripCollection, where('driverId', '==', uid));
    return collectionData(categoryCollection, { idField: 'id' }) as Observable<
      Notification[]
    >;
  }

  getItems(): Observable<Item[]> {
    const categoryCollection = collection(this.firestore, 'items');
    const queryList = query(categoryCollection, orderBy('adDate', 'desc'));
    return collectionData(queryList, { idField: 'id' }) as Observable<Item[]>;
    // const queryList = query(tripCollection, where('driverId', '==', uid));
    // return collectionData(categoryCollection, {idField: 'id'}) as Observable<Item[]>;
  }
  public getServices(): Observable<Service[]> {
    const servicesCollection = collection(this.firestore, 'services');
    const queryList = query(servicesCollection, orderBy('created_at', 'desc'));
    return collectionData(queryList, { idField: 'id' }) as Observable<
      Service[]
    >;
  }
  getReports(): Observable<Report[]> {
    const categoryCollection = collection(this.firestore, 'report');
    return collectionData(categoryCollection, { idField: 'id' }) as Observable<
      Report[]
    >;
  }
  addSubAdmins(subAdmins: SubAdmins): Promise<any> {
    try {
      const categoryCollection = collection(this.firestore, 'subadmins');
      return addDoc(categoryCollection, subAdmins);
    } catch (e) {
      console.error(e);
    }
  }
  getSubAdmins(): Observable<SubAdmins[]> {
    const categoryCollection = collection(this.firestore, 'users');
    const queryList = query(
      categoryCollection,
      where('type', '==', 'admin'),
      where('isSuperAdmin', '==', false)
    );
    return collectionData(queryList, { idField: 'id' }) as Observable<
      SubAdmins[]
    >;
  }
  getUsers(): Observable<User[]> {
    const categoryCollection = collection(this.firestore, 'users');
    const queryList = query(
      categoryCollection,
      where('type', '==', 'users'),
      orderBy('joined', 'desc')
    );
    return collectionData(queryList, { idField: 'id' }) as Observable<User[]>;
  }
  getUsersProviders(): Observable<User[]> {
    const categoryCollection = collection(this.firestore, 'provider');
    const queryList = query(
      categoryCollection,
      where('type', '==', 'provider'),
      orderBy('SrNo', 'desc')
    );
    return collectionData(queryList, { idField: 'id' }) as Observable<User[]>;
  }
  getUsersProvidersList(
    startAfterDoc: any,
    pageSize: number
  ): Observable<User[]> {
    const categoryCollection = collection(this.firestore, 'provider');

    // Build the query with pagination and sorting
    let queryList = query(
      categoryCollection,
      where('type', '==', 'provider'),
      orderBy('SrNo', 'desc'),
      limit(pageSize)
    );

    // Add cursor for pagination if `startAfterDoc` is provided
    if (startAfterDoc) {
      queryList = query(
        categoryCollection,
        where('type', '==', 'provider'),
        orderBy('SrNo', 'desc'),
        startAfter(startAfterDoc),
        limit(pageSize)
      );
    }

    return collectionData(queryList, { idField: 'id' }) as Observable<User[]>;
  }

  async countUsersProviders(): Promise<Observable<number>> {
    const categoryCollection = collection(this.firestore, 'provider');
    const queryList = query(
      categoryCollection,
      where('type', '==', 'provider')
    );
    const snapshot = await getCountFromServer(queryList);
    return snapshot.data().count as unknown as Observable<number>;
  }
  getServiceProvidersLength(): Observable<User[]> {
    const categoryCollection = collection(this.firestore, 'provider');
    const queryList = query(
      categoryCollection,
      where('type', '==', 'provider'),
      where('status', '==', 'approved'),
      orderBy('SrNo', 'desc')
    );
    return collectionData(queryList, { idField: 'id' }) as Observable<User[]>;
  }

  getUsersProvidersByCityArea(city: any, area: any): Observable<User[]> {
    const categoryCollection = collection(this.firestore, 'provider');
    const queryList = query(
      categoryCollection,
      where('type', '==', 'provider'),
      where('city', '==', city),
      where('area', '==', area),
      where('status', '==', 'approved')
    );
    return collectionData(queryList, { idField: 'id' }) as Observable<User[]>;
  }

  getUsersList(): Observable<User[]> {
    const postCollection = collection(this.firestore, 'users');
    const queryList = query(postCollection, orderBy('joined'));
    return collectionData(queryList, { idField: 'id' }) as Observable<User[]>;
  }
  getContent(): Observable<Content[]> {
    const categoryCollection = collection(this.firestore, 'content');
    const queryList = query(categoryCollection);
    return collectionData(queryList, { idField: 'id' }) as Observable<
      Content[]
    >;
  }
  //Get user by Id
  getUserById(id: string): Observable<User> {
    const document = doc(this.firestore, `users/${id}`);
    return docSnapshots(document).pipe(
      map((doc) => {
        const id = doc.id;
        const data = doc.data();
        return { id, ...data } as User;
      })
    );
  }

  async addCategory(cameraFile: Photo, name) {
    const id = Date.now();
    const path = `uploads/${id}/images.png`;
    const storageRef = ref(this.storage, path);

    try {
      await uploadString(storageRef, cameraFile.base64String, 'base64');

      const imageUrl = await getDownloadURL(storageRef);
      const docRef = await addDoc(collection(this.firestore, 'categories'), {
        name: name,
        image: imageUrl,
        status: 'active',
      });
      return true;
    } catch (e) {
      return null;
    }
  }

  getCategory(id: string): Observable<Category> {
    const document = doc(this.firestore, `categories/${id}`);
    return docSnapshots(document).pipe(
      map((doc) => {
        const id = doc.id;
        const data = doc.data();
        return { id, ...data } as Category;
      })
    );
  }

  async updateCategory(cameraFile: Photo, name, id) {
    const ids = Date.now();
    const path = `uploads/${ids}/images.png`;
    const storageRef = ref(this.storage, path);

    try {
      await uploadString(storageRef, cameraFile.base64String, 'base64');

      const imageUrl = await getDownloadURL(storageRef);
      const catRef = doc(this.firestore, 'categories', id);
      await updateDoc(catRef, {
        name: name,
        image: imageUrl,
      });
      return true;
    } catch (e) {
      return null;
    }
  }

  async addSubCategory(cameraFile: any, name, category) {
    console.log(cameraFile);
    const id = Date.now();
    const path = `uploads/${id}/image.png`;
    const storageRef = ref(this.storage, path);

    try {
      await uploadString(storageRef, cameraFile.base64String, 'base64');
      const imageUrl = await getDownloadURL(storageRef);
      const docRef = await addDoc(
        collection(this.firestore, 'sub-categories'),
        {
          name: name,
          image: imageUrl,
          category: category,
          status: 'active',
        }
      );
      return true;
    } catch (e) {
      return null;
    }
  }
  async addService(
    cameraFile: Photo,
    name: any,
    category: any,
    subCategory: any,
    description: any,
    price: any,
    commission: any,
    serviceProviderCharge: any
  ) {
    const id = Date.now();
    const path = `uploads/${id}/image.png`;
    const storageRef = ref(this.storage, path);
    try {
      await uploadString(storageRef, cameraFile.base64String, 'base64');
      const imageUrl = await getDownloadURL(storageRef);
      const docRef = await addDoc(collection(this.firestore, 'services'), {
        name: name,
        image: imageUrl,
        category: category,
        subCategory: subCategory,
        description: description,
        price: price,
        commission: commission,
        serviceProviderCharge: serviceProviderCharge,
        status: 'active',
        created_at: new Date(),
      });
      return true;
    } catch (e) {
      return null;
    }
  }
  getCustomersList(): Observable<User[]> {
    const categoryCollection = collection(this.firestore, 'users');
    const queryList = query(categoryCollection, where('type', '==', 'users'));
    return collectionData(queryList, { idField: 'id' }) as Observable<User[]>;
  }
  getSubCategories(): Observable<Subcategory[]> {
    const categoryCollection = collection(this.firestore, 'sub-categories');
    //const queryList = query(tripCollection, where('driverId', '==', uid));
    return collectionData(categoryCollection, { idField: 'id' }) as Observable<
      Subcategory[]
    >;
  }

  getSubCategory(id: string): Observable<Subcategory> {
    const document = doc(this.firestore, `sub-categories/${id}`);
    return docSnapshots(document).pipe(
      map((doc) => {
        const id = doc.id;
        const data = doc.data();
        return { id, ...data } as Subcategory;
      })
    );
  }
  getSubCategoriesByCategories(id): Observable<Subcategory[]> {
    const categoryCollection = collection(this.firestore, 'sub-categories');
    const queryList = query(categoryCollection, where('category', '==', id));
    return collectionData(queryList, { idField: 'id' }) as Observable<
      Subcategory[]
    >;
  }

  getSubCatbyCat(id): Observable<Subcategory[]> {
    const categoryCollection = collection(this.firestore, 'sub-categories');
    const queryList = query(categoryCollection, where('category', '==', id));
    return collectionData(queryList, { idField: 'id' }) as Observable<
      Subcategory[]
    >;
  }

  async updateSubCategory(cameraFile: Photo, name, category, id) {
    const ids = Date.now();
    const path = `uploads/${ids}/image.png`;
    const storageRef = ref(this.storage, path);

    try {
      await uploadString(storageRef, cameraFile.base64String, 'base64');

      const imageUrl = await getDownloadURL(storageRef);
      const catRef = doc(this.firestore, 'sub-categories', id);
      await updateDoc(catRef, {
        name: name,
        category: category,
        image: imageUrl,
      });
      return true;
    } catch (e) {
      return null;
    }
  }

  async addBrand(cameraFile: Photo, name, category) {
    const id = Date.now();
    const path = `uploads/${id}/images.png`;
    const storageRef = ref(this.storage, path);

    try {
      await uploadString(storageRef, cameraFile.base64String, 'base64');

      const imageUrl = await getDownloadURL(storageRef);
      const docRef = await addDoc(collection(this.firestore, 'brands'), {
        name: name,
        image: imageUrl,
        category: category,
      });
      return true;
    } catch (e) {
      return null;
    }
  }

  async updateBrand(cameraFile: Photo, name, category, id) {
    const ids = Date.now();
    const path = `uploads/${ids}/images.png`;
    const storageRef = ref(this.storage, path);

    try {
      await uploadString(storageRef, cameraFile.base64String, 'base64');

      const imageUrl = await getDownloadURL(storageRef);
      const catRef = doc(this.firestore, 'brands', id);
      await updateDoc(catRef, {
        name: name,
        image: imageUrl,
        category: category,
      });
      return true;
    } catch (e) {
      return null;
    }
  }
  // async addCity(city:any) {
  //   try {
  //     const docRef = await addDoc(collection(this.firestore, "cities"), {
  //       countryCode: city.countryCode,
  //       name: city.name,
  //       stateCode: city.stateCode,
  //       latitude: city.latitude,
  //       longitude: city.longitude
  //     });
  //     return true;
  //   } catch (e) {
  //     return null;
  //   }
  // }
  async addCity(city: any) {
    try {
      const docRef = await addDoc(collection(this.firestore, 'cities'), {
        countryCode: city.country || 'India',
        name: city.city,
        stateCode: city.state,
        latitude: city.latitude || 0,
        longitude: city.longitude || 0,
      });
      console.log('Document written with ID: ', docRef.id);
      return true;
    } catch (e) {
      console.error('Error adding document: ', e);
      return null;
    }
  }
  getAllCities(): Observable<any> {
    const categoryCollection = collection(this.firestore, 'cities');
    const queryList = query(categoryCollection, orderBy('name', 'asc'));
    return collectionData(queryList, { idField: 'id' }) as Observable<any>;
  }
  // getCategories(): Observable<Category[]>{
  //   const categoryCollection = collection(this.firestore, 'categories');
  //   return collectionData(categoryCollection, {idField: 'id'}) as Observable<Category[]>;
  // }
  getAllCitiesById(): Observable<any> {
    const categoryCollection = collection(this.firestore, 'cities');
    return collectionData(categoryCollection, {
      idField: 'id',
    }) as Observable<any>;
  }
  getAllCitiesbyArea(): Observable<any> {
    const categoryCollection = collection(this.firestore, 'cityarea');
    return collectionData(categoryCollection, {
      idField: 'id',
    }) as Observable<any>;
  }

  async addCityArea(cityArea: any) {
    try {
      const docRef = await addDoc(collection(this.firestore, 'cityarea'), {
        cityId: cityArea.cityId,
        cityName: cityArea.cityName,
        name: cityArea.name,
      });
      console.log('Document written with ID: ', docRef.id);
      return true;
    } catch (e) {
      console.error('Error adding document: ', e);
      return null;
    }
  }
  getAllCityAreas(): Observable<any> {
    const categoryCollection = collection(this.firestore, 'cityarea');
    const queryList = query(categoryCollection, orderBy('name', 'asc'));
    return collectionData(queryList, { idField: 'id' }) as Observable<any>;
  }
  getAllAreabyCity(id): Observable<any> {
    const categoryCollection = collection(this.firestore, 'cityarea');
    const queryList = query(
      categoryCollection,
      where('cityId', '==', id),
      orderBy('name', 'asc')
    );
    return collectionData(queryList, { idField: 'id' }) as Observable<any>;
  }
  public getAllAreas(cityId): Observable<any> {
    const categoryCollection = collection(this.firestore, 'cityarea');
    const queryList = query(
      categoryCollection,
      where('cityId', '==', cityId),
      orderBy('name', 'asc')
    );
    return collectionData(queryList, { idField: 'id' }) as Observable<any>;
  }
  deleteCity(id) {
    const catRef = doc(this.firestore, 'cities', id);
    deleteDoc(catRef);
  }
  async addPackage(packages) {
    try {
      const docRef = await addDoc(collection(this.firestore, 'packages'), {
        name: packages.name,
        noOfBookings: packages.noOfBookings,
        cost: packages.cost,
        duration: packages.duration,
      });
      return true;
    } catch (e) {
      return null;
    }
  }
  async updatePackage(packages) {
    const catRef = doc(this.firestore, 'packages', packages.id);
    await updateDoc(catRef, {
      name: packages.name,
      noOfBookings: packages.noOfBookings,
      cost: packages.cost,
      duration: packages.duration,
    });
  }
  getAllPackages(): Observable<any> {
    const categoryCollection = collection(this.firestore, 'packages');
    const queryList = query(categoryCollection, orderBy('cost', 'asc'));
    return collectionData(queryList, { idField: 'id' }) as Observable<any>;
  }
  deletePackage(id) {
    const catRef = doc(this.firestore, 'packages', id);
    deleteDoc(catRef);
  }
  async addSubscription(packages) {
    try {
      const docRef = await addDoc(collection(this.firestore, 'subscription'), {
        name: packages.name,
        noOfAds: packages.noOfAds,
        cost: packages.cost,
        duration: packages.duration,
      });
      return true;
    } catch (e) {
      return null;
    }
  }
  getAllSubscriptions(): Observable<any> {
    const categoryCollection = collection(this.firestore, 'subscription');
    const queryList = query(categoryCollection, orderBy('name', 'asc'));
    return collectionData(queryList, { idField: 'id' }) as Observable<any>;
  }
  deleteSubscriiption(id) {
    const catRef = doc(this.firestore, 'subscription', id);
    deleteDoc(catRef);
  }
  public getLoanApplications(): Observable<any> {
    const categoryCollection = collection(this.firestore, 'loan');
    const queryList = query(categoryCollection, orderBy('name', 'desc'));
    return collectionData(queryList, { idField: 'id' }) as Observable<any>;
  }
  getBookingsByUser(id): Observable<any[]> {
    const categoryCollection = collection(this.firestore, 'bookings');
    const queryList = query(
      categoryCollection,
      where('uid', '==', id),
      where('jobStatus', '==', 'pending')
    );
    return collectionData(queryList, { idField: 'id' }) as Observable<any[]>;
  }
  getAllComplaint(): Observable<any[]> {
    const categoryCollection = collection(this.firestore, 'complaints');
    const queryList = query(categoryCollection, orderBy('created_at', 'desc'));
    return collectionData(queryList, { idField: 'id' }) as Observable<any[]>;
  }
  getAllBookings(): Observable<Booking[]> {
    const categoryCollection = collection(this.firestore, 'bookings');
    const queryList = query(categoryCollection, orderBy('date', 'desc'));
    return collectionData(queryList, { idField: 'id' }) as Observable<
      Booking[]
    >;
  }
  getAllBookingsByJobStatus(status): Observable<Booking[]> {
    const categoryCollection = collection(this.firestore, 'bookings');
    const queryList = query(
      categoryCollection,
      where('jobStatus', '==', status),
      orderBy('date', 'desc')
    );
    return collectionData(queryList, { idField: 'id' }) as Observable<
      Booking[]
    >;
  }
  public getAllBookingReports(to: string, from: string): Observable<any[]> {
    const categoryCollection = collection(this.firestore, 'bookings');
    const queryList = query(
      categoryCollection,
      where('schedule.date', '>=', from),
      where('schedule.date', '<=', to)
    );
    return collectionData(queryList, { idField: 'id' }) as Observable<any[]>;
  }
  public getAllRefundedBookingReports(
    to: string,
    from: string
  ): Observable<any[]> {
    const categoryCollection = collection(this.firestore, 'bookings');
    const queryList = query(
      categoryCollection,
      where('schedule.date', '>=', from),
      where('schedule.date', '<=', to),
      where('jobStatus', '==', 'cancel')
    );
    return collectionData(queryList, { idField: 'id' }) as Observable<any[]>;
  }
  public getAllProviderReports(to: string, from: string): Observable<any[]> {
    const categoryCollection = collection(this.firestore, 'provider');
    const queryList = query(
      categoryCollection,
      where('dateOfApproval', '>=', from),
      where('dateOfApproval', '<=', to)
    );
    return collectionData(queryList, { idField: 'id' }) as Observable<any[]>;
  }
  public getAllTransactionReports(to: string, from: string): Observable<any[]> {
    const categoryCollection = collection(this.firestore, 'provider');
    const queryList = query(
      categoryCollection,
      where('dateOfApproval', '>=', from),
      where('dateOfApproval', '<=', to)
    );
    return collectionData(queryList, { idField: 'id' }) as Observable<any[]>;
  }
}
