import * as cors from 'cors';
import * as admin from 'firebase-admin';
import * as util from '../utils/constants';
import * as functions from 'firebase-functions';

const corsHandler = cors({ origin: true });

export default functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        try {
            const queryId = req.query.id ?? '';
            const formattedId = Array.isArray(queryId) ? queryId[0] : queryId;
            const uid = formattedId.toString();

            const queryUid = req.query.uid ?? '';
            const formattedUid = Array.isArray(queryUid) ? queryUid[0] : queryUid;
            const uidString = formattedUid.toString();


            const docId = uidString.concat('_').concat(uid);
            const docId2 = uid.concat('_').concat(uidString);

            const batch = admin.firestore().batch();

            await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).collection(util.FunctionsConstants.Chats).doc(docId2).collection('messages').listDocuments().then((val) => {
                val.map((val) => {
                    batch.delete(val);
                });
                batch.commit();
            });

            await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).collection(util.FunctionsConstants.Chats).doc(docId2).delete();

            const batch2 = admin.firestore().batch();

            await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).collection(util.FunctionsConstants.Chats).doc(docId).collection('messages').listDocuments().then((val) => {
                val.map((val) => {
                    batch2.delete(val);
                });
                batch2.commit();
            });

            await admin.firestore().collection(util.FunctionsConstants.Users).doc(uidString).collection(util.FunctionsConstants.Chats).doc(docId).delete();


            res.status(200).send(util.SuccessMessages.SuccessMessage);
            return;
        } catch (error) {
            console.error(util.ErrorMessages.ErrorText, error);
            res.status(404).send(util.ErrorMessages.UnexpectedError);
            return;
        }
    });
});
