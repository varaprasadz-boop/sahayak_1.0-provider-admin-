import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  getAuth,
  signOut,
} from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { User } from '../models/user';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private readonly auth: Auth, private readonly firestore: Firestore) {}

  getUser(): any {
    return this.auth.currentUser;
  }

  getUser$(): Observable<User> {
    return of(this.getUser());
  }

  login(email: string, password: string): Promise<any> {
     return signInWithEmailAndPassword(this.auth, email, password);
  }

  async signup(email: string, password: string, displayName: string, phoneNumber: string): Promise<any> {
    try {
      const newany: any = await createUserWithEmailAndPassword(this.auth, email, password);
      const userProfileDocumentReference = doc(this.firestore, `users/${newany.user.uid}`);
      localStorage.setItem("uid", newany.user.uid);
      localStorage.setItem('isLoggedIn','true')
      await setDoc(userProfileDocumentReference, {
        email: email, 
        displayName: displayName,
        photoURL: 'assets/avatar.gif',
        phoneNumber: phoneNumber,
        following: [],
        followers: [],
        block: false,
        joined: Date.now(),
      });
      return newany;
    } catch (error) {
      throw error;
    }
  }

  resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  public isLoggedIn2(): boolean {
    const result = localStorage.getItem('isLoggedInAdmins');
    console.log(result);
    if (result == null) {
      console.log(result)
      return false;
    } 
    else {
    console.log(result)
    return true;
  }
}

}