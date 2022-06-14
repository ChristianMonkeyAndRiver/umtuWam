import { Inject, Injectable, NgZone } from '@angular/core';
import { concatMap, from, Observable, of, switchMap } from 'rxjs';
import {
  Auth, signInWithEmailAndPassword, UserInfo,
  UserCredential, authState
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser$ = authState(this.auth);
  constructor(@Inject(Auth) private auth: Auth) { }

  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password))
  }

  logout(): Observable<any> {
    return from(this.auth.signOut());
  }

  // // Sign in with email/password
  // async SignIn(email: string, password: string) {
  //   try {
  //     await this.afAuth
  //       .signInWithEmailAndPassword(email, password);
  //     this.ngZone.run(() => {
  //       this.router.navigate(['dashboard']);
  //     });
  //   } catch (error) {
  //     window.alert(error);
  //   }
  // }

  // // Returns true when user is looged in and email is verified
  // get isLoggedIn(): boolean {
  //   const user = JSON.parse(localStorage.getItem('user')!);
  //   return user !== null;
  // }

  // // Auth logic to run auth providers
  // async AuthLogin(provider: any) {
  //   try {
  //     await this.afAuth
  //       .signInWithPopup(provider);
  //     this.ngZone.run(() => {
  //       this.router.navigate(['dashboard']);
  //     });
  //   } catch (error) {
  //     window.alert(error);
  //   }
  // }

  // // Sign out
  // async SignOut() {
  //   await this.afAuth.signOut();
  //   localStorage.removeItem('user');
  //   this.router.navigate(['login']);
  // }
}
