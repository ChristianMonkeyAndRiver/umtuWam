import * as cors from 'cors';
import * as admin from 'firebase-admin';
import * as util from '../utils/constans';
import * as functions from 'firebase-functions';

const corsHandler = cors({origin: true});

export default functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        try {
            const queryId = req.query.id ?? '';
            const formattedId = Array.isArray(queryId) ? queryId[0] : queryId;
            const uid = formattedId.toString();

            const userDocument = await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).get();

            if (!userDocument.exists) {
                res.status(500).send(util.ErrorMessages.NoUserError);
                return;
            }


            const queryUid = req.query.uid ?? '';
            const formattedUid = Array.isArray(queryUid) ? queryUid[0] : queryUid;
            const uidString = formattedUid.toString();


            const userB = uidString;
            const userBdoc = await admin.firestore().collection(util.FunctionsConstants.Users).doc(userB).get();

            const docId = userB.concat('_').concat(uid);
            const docId2 = uid.concat('_').concat(userB);

            await admin.firestore().collection(util.FunctionsConstants.Likes).doc(docId).get()
            .then(async (doc) => {
                if (!doc.exists) {
                    await admin.firestore().collection(util.FunctionsConstants.Likes).doc(docId2).set({
                        userA: uid,
                        userB: userB,
                    });
                } else {
                    await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).collection(util.FunctionsConstants.Chats).doc(docId2).set({
                        id: userB,
                        chatsPaymentID: '',
                        imagesPaymentID: '',
                        name: userBdoc.data()?.name,
                        imageUrl: userBdoc.data()?.images.length > 0 ? userBdoc.data()?.images[0] : util.FunctionsConstants.DefualtImage,
                    });
                    await admin.firestore().collection(util.FunctionsConstants.Users).doc(userB).collection(util.FunctionsConstants.Chats).doc(docId).set({
                        id: uid,
                        chatsPaymentID: '',
                        imagesPaymentID: '',
                        name: userDocument.data()?.name,
                        imageUrl: userDocument.data()?.images.length > 0 ? userDocument.data()?.images[0] : util.FunctionsConstants.DefualtImage,
                    });
                    await admin.firestore().collection(util.FunctionsConstants.Likes).doc(docId).delete();
                }
            });


            res.status(200).send(util.SuccessMessages.SuccessMessage);
            return;
        } catch (error) {
            console.error(util.ErrorMessages.ErrorText, error);
            res.status(404).send(util.ErrorMessages.UnexpectedExrror);
            return;
        }
    });
});
