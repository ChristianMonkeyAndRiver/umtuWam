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

            const chatId = uid.concat('_').concat(uidString);
            const timestamp = admin.firestore.Timestamp.now();

            await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).collection(util.FunctionsConstants.Chats).doc(chatId).collection(util.FunctionsConstants.Messages)
            .doc()
            .set({
                idFrom: uid,
                idTo: uidString,
                timestamp: timestamp,
                content: req.query.content,
            });

            const chatId2 = uidString.concat('_').concat(uid);

            await admin.firestore().collection(util.FunctionsConstants.Users).doc(uidString).collection(util.FunctionsConstants.Chats).doc(chatId2).collection(util.FunctionsConstants.Messages)
            .doc()
            .set({
                idFrom: uid,
                idTo: uidString,
                timestamp: timestamp,
                content: req.query.content,
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
