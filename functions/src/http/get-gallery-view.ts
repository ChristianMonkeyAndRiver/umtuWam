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
            const id = formattedId.toString();

            const queryUid = req.query.uid ?? '';
            const formattedUid = Array.isArray(queryUid) ? queryUid[0] : queryUid;
            const uid = formattedUid.toString();

            const docId = id.concat('_').concat(uid);

            const subscriptionDoc = await admin.firestore()
                .collection(util.FunctionsConstants.Subscriptions)
                .doc(docId)
                .get();

            if (subscriptionDoc.exists) {
                res.set('Content-Type', 'application/xml');
                res.status(200).send({ value: true });
                return;
            }
            res.set('Content-Type', 'application/xml');
            res.status(200).send({ value: false });
            return;
        } catch (error) {
            console.error(error);
            res.status(404).send(util.ErrorMessages.UnexpectedError);
            return;
        }
    });
});
