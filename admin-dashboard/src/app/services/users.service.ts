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

  getAll(index: number): AngularFirestoreCollection<UserModel> {
    const response = this.db.collection<UserModel>(this.dbPath, ref => 
      ref
        .orderBy('name')
        .startAt(index)
        .limit(30)
        .where('isBanned', '==', false)
    );
    return response;
  }

  getAllBanned(index: number): AngularFirestoreCollection<UserModel> {
    return this.db.collection<UserModel>(this.dbPath, ref => 
      ref
        .orderBy('name')
        .startAt(index)
        .limit(30)
        .where('isBanned', '==', true)
    );
  }

  update(id: string, data: any): Promise<void> {
    return this.usersRef.doc(id).update(data);
  }
}
