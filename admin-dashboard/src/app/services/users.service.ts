import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private angularFirestore: AngularFirestore){}

  loadUsers()  {
    return this.angularFirestore.collection(
      'users',
      ref => ref
        .limit(10)
        .orderBy('name')
        .where('isBanned', '==', false)
    ).snapshotChanges();
  }

  loadPrev(startAtDoc: any, firstInResponse: any) {
    return this.angularFirestore.collection(
      'users',
      ref => ref
        .limit(10)
        .orderBy('name')
        .startAt(startAtDoc)
        .endBefore(firstInResponse)
        .where('isBanned', '==', false)
    ).get();
  }

  loadNext(lastInResponse: any) {
    return this.angularFirestore.collection(
      'users',
      ref => ref
        .limit(10)
        .orderBy('name')
        .startAfter(lastInResponse)
        .where('isBanned', '==', false)
    ).get();
  }

  loadBannedUsers()  {
    return this.angularFirestore.collection(
      'users',
      ref => ref
        .limit(10)
        .orderBy('name')
        .where('isBanned', '==', true)
    ).snapshotChanges();
  }

  loadBannedPrev(startAtDoc: any, firstInResponse: any) {
    return this.angularFirestore.collection(
      'users',
      ref => ref
        .limit(10)
        .orderBy('name')
        .startAt(startAtDoc)
        .endBefore(firstInResponse)
        .where('isBanned', '==', true)
    ).get();
  }

  loadBannedNext(lastInResponse: any) {
    return this.angularFirestore.collection(
      'users',
      ref => ref
        .limit(10)
        .orderBy('name')
        .startAfter(lastInResponse)
        .where('isBanned', '==', true)
    ).get();
  }

  searchUsers(startcode: string, endcode: string) {
    return startcode === ''?  
      this.angularFirestore.collection(
        'users',
        ref => ref
          .limit(10)
          .orderBy('name')
          .where('isBanned', '==', false)
      ).get() : 
      this.angularFirestore.collection(
      'users',
      ref => ref
        .limit(10)
        .orderBy('name')
        .where('name', '>=', startcode)
        .where('name', '<', endcode)
        .where('isBanned', '==', false)
    ).get();
  }
}
