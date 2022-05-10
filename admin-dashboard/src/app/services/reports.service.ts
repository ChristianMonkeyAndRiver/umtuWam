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

  loadReports(): AngularFirestoreCollection<ReportsModel> {
    return this.db.collection<ReportsModel>(this.dbPath, ref =>
      ref
        .limit(5)
    );
  }


  loadPrev(startAtDoc: any, firstInResponse: any): AngularFirestoreCollection<ReportsModel> {
    return this.db.collection<ReportsModel>(this.dbPath, ref =>
      ref
        .limit(5)
        .startAt(startAtDoc)
        .endBefore(firstInResponse)
    );
  }

  loadNext(lastInResponse: any): AngularFirestoreCollection<ReportsModel> {
    return this.db.collection<ReportsModel>(this.dbPath, ref =>
      ref
        .limit(5)
        .startAfter(lastInResponse)
    );
  }

  update(id: string, data: any): Promise<void> {
    return this.usersRef.doc(id).update(data);
  }
}
