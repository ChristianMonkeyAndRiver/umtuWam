import * as admin from 'firebase-admin';
import * as util from '../utils/constans';
import * as functions from 'firebase-functions';

export default functions.firestore.document('users/{docId}')
.onCreate(async (snap) => {
  const newDoc = snap.data();

  const userDoc = await admin.firestore().collection(util.FunctionsConstants.Users).doc(newDoc.transgressorId).get();

  snap.ref.set({
    name: userDoc.data()?.name,
    gender: userDoc.data()?.gender,
    bio: userDoc.data()?.bio,
    images: userDoc.data()?.images,
    location: userDoc.data()?.location,
  }, {merge: true});
});
