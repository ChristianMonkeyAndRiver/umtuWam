import * as cors from 'cors';
import * as admin from 'firebase-admin';
import * as util from '../utils/constants';
import * as functions from 'firebase-functions';

const corsHandler = cors({ origin: true });

export default functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        const queryId = req.query.id ?? '';
        const formattedId = Array.isArray(queryId) ? queryId[0] : queryId;
        const uid = formattedId.toString();

        try {
            const userDocument = await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).get();

            if (!userDocument.exists) res.status(500).send(util.ErrorMessages.NoUserError);

            res.set('Content-Type', 'application/xml');

            res.status(200).send(userDocument.data());
            return;
        } catch (error) {
            console.error(util.ErrorMessages.ErrorText, error);

            res.status(404).send(util.ErrorMessages.UnexpectedError);
            return;
        }
    });
});
