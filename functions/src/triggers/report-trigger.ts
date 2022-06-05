import * as admin from 'firebase-admin';
import * as util from '../utils/constants';
import * as functions from 'firebase-functions';

export default functions.firestore.document('reports/{docId}')
  .onCreate(async (snap) => {
    try {
      const newDoc = snap.data();

      const userDoc = await admin.firestore().collection(util.FunctionsConstants.Users).doc(newDoc.transgressorId).get();

      const reports = userDoc.data()?.reports;
      await userDoc.ref.update({
        reports: (reports + 1),
      });

      return snap.ref.set({
        name: userDoc.data()?.name,
        gender: userDoc.data()?.gender,
        bio: userDoc.data()?.bio,
        images: userDoc.data()?.images,
        location: userDoc.data()?.location,
        isBanned: userDoc.data()?.isBanned,
        reports: (reports + 1),
      }, { merge: true });
    } catch (error) {
      console.error(util.ErrorMessages.ErrorText, error);
      return;
    }
  });
