import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private usersDBPath = '/users';
  private dbPath = '/reports';
  constructor(private angularFirestore: AngularFirestore){}

  loadReports()  {
    return this.angularFirestore.collection(
      'reports',
      ref => ref
         .where('reports', '>=', 2)
        .limit(20)
    ).snapshotChanges();
  }

  loadPrev(startAtDoc: any, firstInResponse: any) {
    return this.angularFirestore.collection(
      'reports',
      ref => ref
      .where('reports', '>=', 2)
      .limit(20)
      .startAt(startAtDoc)
      .endBefore(firstInResponse)
    ).get();
  }

  loadNext(lastInResponse: any) {
    return this.angularFirestore.collection(
      'reports',
      ref => ref
      .where('reports', '>=', 2)
      .limit(20)
      .startAfter(lastInResponse)
    ).get();
  }

  // update(id: string, data: any): Promise<void> {
  //   return this.usersRef.doc(id).update(data);
  // }
}
