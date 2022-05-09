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

  getAll(): AngularFirestoreCollection<UserModel> {
    return this.db.collection<UserModel>(this.dbPath, ref => 
      ref
        .limit(7)
        .where('isBanned', '==', false)
    );
  }

  getAllBanned(): AngularFirestoreCollection<UserModel> {
    return this.db.collection<UserModel>(this.dbPath, ref => 
      ref
        .limit(7)
        .where('isBanned', '==', true)
    );
  }

  update(id: string, data: any): Promise<void> {
    return this.usersRef.doc(id).update(data);
  }
}
