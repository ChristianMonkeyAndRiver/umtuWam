import { Injectable, NgZone  } from '@angular/core';
import { User } from '../services/user';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any; // Save logged in user data

  constructor(
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone //
  ) { 
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  // Sign in with email/password
  async SignIn(email: string, password: string) {
    try {
      await this.afAuth
        .signInWithEmailAndPassword(email, password);
      this.ngZone.run(() => {
        this.router.navigate(['dashboard']);
      });
    } catch (error) {
      window.alert(error);
    }
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null;
  }

  // Auth logic to run auth providers
  async AuthLogin(provider: any) {
    try {
      await this.afAuth
        .signInWithPopup(provider);
      this.ngZone.run(() => {
        this.router.navigate(['dashboard']);
      });
    } catch (error) {
      window.alert(error);
    }
  }

  // Sign out
  async SignOut() {
    await this.afAuth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['sign-in']);
  }
}
