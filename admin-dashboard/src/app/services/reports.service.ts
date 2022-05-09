import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { ReportsModel } from '../models/reports_model';
import { UserModel } from '../models/user_model';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private usersDBPath = '/users';
  private dbPath = '/reports';
  usersRef: AngularFirestoreCollection<UserModel>;
  reportsRef: AngularFirestoreCollection<ReportsModel>;
  constructor(private db: AngularFirestore) {
    this.usersRef = db.collection(this.usersDBPath);
    this.reportsRef = db.collection(this.dbPath);
  }

  getAll(): AngularFirestoreCollection<ReportsModel> {
    return this.db.collection<ReportsModel>(this.dbPath, ref => 
      ref
        .limit(10)
    );
  }

  update(id: string, data: any): Promise<void> {
    return this.usersRef.doc(id).update(data);
  }
}
