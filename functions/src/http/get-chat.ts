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

            const userDocument = await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).get();

            if (!userDocument.exists) {
                res.status(404).send(util.ErrorMessages.NoUserError);
                return;
            }

            const chatId = uid.concat('_').concat(uidString);

            await admin.firestore().collection(util.FunctionsConstants.Users)
                .doc(uid)
                .collection(util.FunctionsConstants.Chats)
                .doc(chatId)
                .collection(util.FunctionsConstants.Messages)
                .orderBy(util.FunctionsConstants.Timestamp)
                .limit(20)
                .get()
                .then((docs) => {
                    if (docs.empty) {
                        res.set('Content-Type', 'application/xml');
                        res.status(200).send([]);
                        return;
                    }

                    const docsArray = [];
                    for (const doc of docs.docs) {
                        docsArray.push(doc.data());
                    }
                    res.set('Content-Type', 'application/xml');
                    res.status(200).send(docsArray);
                    return;
                });
        } catch (error) {
            console.error(error);
            res.status(404).send(util.ErrorMessages.UnexpectedError);
            return;
        }
    });
});
