import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewProfileServiceService {

  obj: any = {
    name: '',
    abuse: 0,
    bio: '',
    gender: '',
    location: '',
    images: [],
  };
  private userSource = new BehaviorSubject<any>(this.obj);
  currentUser = this.userSource.asObservable();

  constructor() { }

  setUser(user: any) {
    // Call next to change the current value;
    this.userSource.next(user);
  }
}
