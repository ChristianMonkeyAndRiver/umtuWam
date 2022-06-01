import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { UserModel } from '../models/user_model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private dbPath = '/users';
  usersRef: AngularFirestoreCollection<UserModel>;
  bannedUserRef: AngularFirestoreCollection<UserModel>;

  constructor(private db: AngularFirestore) {
    this.usersRef = db.collection(this.dbPath);
    this.bannedUserRef = db.collection(this.dbPath);
  }

  loadSearch(startCode: string, endCode: string): AngularFirestoreCollection<UserModel> {
    return this.db.collection<UserModel>(this.dbPath, ref =>
      ref
        .limit(100)
        .orderBy('name')
        .where('name', '>=', startCode)
        .where('name', '<', endCode)
    );
  }

  loadPrev(startAtDoc: any, firstInResponse: any): AngularFirestoreCollection<UserModel> {
    return this.db.collection<UserModel>(this.dbPath, ref =>
      ref
        .limit(100)
        .orderBy('name')
        .startAt(startAtDoc)
        .endBefore(firstInResponse)
        .where('isBanned', '==', false)
    );
  }

  loadNext(lastInResponse: any): AngularFirestoreCollection<UserModel> {
    return this.db.collection<UserModel>(this.dbPath, ref =>
      ref
        .limit(100)
        .orderBy('name')
        .startAfter(lastInResponse)
        .where('isBanned', '==', false)
    );
  }

  loadUsers(): AngularFirestoreCollection<UserModel> {
    return this.db.collection<UserModel>(this.dbPath, ref =>
      ref
        .limit(100)
        .orderBy('name')
        .where('isBanned', '==', false)
    );
  }

  getAllBanned(): AngularFirestoreCollection<UserModel> {
    return this.db.collection<UserModel>(this.dbPath, ref =>
      ref
        .limit(20)
        .orderBy('name')
        .where('isBanned', '==', true)
    );
  }

  loadBannedPrev(startAtDoc: any, firstInResponse: any): AngularFirestoreCollection<UserModel> {
    return this.db.collection<UserModel>(this.dbPath, ref =>
      ref
        .limit(20)
        .orderBy('name')
        .startAt(startAtDoc)
        .endBefore(firstInResponse)
        .where('isBanned', '==', true)
    );
  }

  loadBannedNext(lastInResponse: any): AngularFirestoreCollection<UserModel> {
    return this.db.collection<UserModel>(this.dbPath, ref =>
      ref
        .limit(20)
        .orderBy('name')
        .startAfter(lastInResponse)
        .where('isBanned', '==', true)
    );
  }


  update(id: string, data: any): Promise<void> {
    return this.usersRef.doc(id).update(data);
  }
}
