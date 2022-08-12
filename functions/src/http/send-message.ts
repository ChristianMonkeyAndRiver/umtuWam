import * as cors from 'cors';
import * as admin from 'firebase-admin';
import * as util from '../utils/constants';
import * as functions from 'firebase-functions';
import { sendMoyaMessageAfterMessageHasBeenSent } from '../utils/messaging_api';

const corsHandler = cors({ origin: true });

export default functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        try {
            const queryId = req.query.id ?? '';
            const formattedId = Array.isArray(queryId) ? queryId[0] : queryId;
            const id = formattedId.toString();

            const queryUid = req.query.uid ?? '';
            const formattedUid = Array.isArray(queryUid) ? queryUid[0] : queryUid;
            const uid = formattedUid.toString();

            const chatId = id.concat('_').concat(uid);
            const timestamp = admin.firestore.Timestamp.now();

            await admin.firestore().collection(util.FunctionsConstants.Users).doc(id).collection(util.FunctionsConstants.Chats).doc(chatId).collection(util.FunctionsConstants.Messages)
                .doc()
                .set({
                    idFrom: id,
                    idTo: uid,
                    timestamp: timestamp,
                    content: req.query.content,
                });

            const chatId2 = uid.concat('_').concat(id);

            await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).collection(util.FunctionsConstants.Chats).doc(chatId2).collection(util.FunctionsConstants.Messages)
                .doc()
                .set({
                    idFrom: id,
                    idTo: uid,
                    timestamp: timestamp,
                    content: req.query.content,
                });

            await sendMoyaMessageAfterMessageHasBeenSent(uid);

            res.set('Content-Type', 'application/xml');
            res.status(200).send(util.SuccessMessages.SuccessMessage);
            return;
        } catch (error) {
            console.error(error);
            res.status(404).send(util.ErrorMessages.UnexpectedError);
            return;
        }
    });
});
