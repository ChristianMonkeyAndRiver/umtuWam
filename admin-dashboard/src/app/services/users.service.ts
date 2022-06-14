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
}


  // loadSearch(startCode: string, endCode: string): AngularFirestoreCollection<UserModel> {
  //   return this.db.collection<UserModel>(this.dbPath, ref =>
  //     ref
  //       .limit(100)
  //       .orderBy('name')
  //       .where('name', '>=', startCode)
  //       .where('name', '<', endCode)
  //   );
  // }

  // loadPrev(startAtDoc: any, firstInResponse: any): AngularFirestoreCollection<UserModel> {
  //   return this.db.collection<UserModel>(this.dbPath, ref => 
  //     ref
        // .limit(100)
        // .orderBy('name')
        // .startAt(startAtDoc)
        // .endBefore(firstInResponse)
        // .where('isBanned', '==', false)
  //   );
  // }

  // loadNext(lastInResponse: any): AngularFirestoreCollection<UserModel> {
  //   return this.db.collection<UserModel>(this.dbPath, ref =>
    //   ref
    //     .limit(100)
    //     .orderBy('name')
    //     .startAfter(lastInResponse)
    //     .where('isBanned', '==', false)
    // );
  // }

  // loadUsers(): AngularFirestoreCollection<UserModel> {
    // return this.db.collection<UserModel>(this.dbPath, ref =>
    //   ref
    //     .limit(100)
    //     .orderBy('name')
    //     .where('isBanned', '==', false)
    // );
  // }

  // // tryLoad(firestore: Firestore) {

  // // }

  // update(id: string, data: any): Promise<void> {
  //   return this.usersRef.doc(id).update(data);
  // }

  // update(id: string, data: any): Observable<void> {
  //   // return this.usersRef.doc(id).update(data);
  //   const ref = doc(this.firestore, 'users', id);
  //   return from(updateDoc(ref, data));
  // }
// }
