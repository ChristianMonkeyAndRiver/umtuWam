import * as cors from 'cors';
import * as admin from 'firebase-admin';
import * as util from '../utils/constants';
import * as functions from 'firebase-functions';
import { sendMoyaMessageAfterBeingLiked } from '../utils/messaging_api';

const corsHandler = cors({ origin: true });

export default functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        try {
            const queryId = req.query.id ?? '';
            const formattedId = Array.isArray(queryId) ? queryId[0] : queryId;
            const id = formattedId.toString();

            const userDocument = await admin.firestore().collection(util.FunctionsConstants.Users).doc(id).get();

            const queryUid = req.query.uid ?? '';
            const formattedUid = Array.isArray(queryUid) ? queryUid[0] : queryUid;
            const uid = formattedUid.toString();

            const userBdoc = await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).get();

            const docId = uid.concat('_').concat(id);
            const docId2 = id.concat('_').concat(uid);

            await admin.firestore().collection(util.FunctionsConstants.Likes).doc(docId).get()
                .then(async (doc) => {
                    if (!doc.exists) {
                        await admin.firestore().collection(util.FunctionsConstants.Likes).doc(docId2).set({
                            userA: id,
                            userB: uid,
                        });
                        await sendMoyaMessageAfterBeingLiked(uid);
                    } else {
                        await admin.firestore().collection(util.FunctionsConstants.Users).doc(id).collection(util.FunctionsConstants.Chats).doc(docId2).set({
                            id: uid,
                            chatsPaymentID: '',
                            imagesPaymentID: '',
                            name: userBdoc.data()?.name,
                            imageUrl: userBdoc.data()?.images.length > 0 ? userBdoc.data()?.images[0] : util.FunctionsConstants.DefaultImage,
                        });
                        await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).collection(util.FunctionsConstants.Chats).doc(docId).set({
                            id: id,
                            chatsPaymentID: '',
                            imagesPaymentID: '',
                            name: userDocument.data()?.name,
                            imageUrl: userDocument.data()?.images.length > 0 ? userDocument.data()?.images[0] : util.FunctionsConstants.DefaultImage,
                        });
                        await admin.firestore().collection(util.FunctionsConstants.Likes).doc(docId).delete();
                    }
                });


            res.status(200).send(util.SuccessMessages.SuccessMessage);
            return;
        } catch (error) {
            console.error(util.ErrorMessages.ErrorText, error);
            res.status(404).send(util.ErrorMessages.UnexpectedError);
            return;
        }
    });
});
