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

            const document = await admin
                .firestore()
                .collection(util.FunctionsConstants.Users)
                .doc(id)
                .get();

            res.status(200).send(document.data());
            return;
        } catch (error) {
            console.error(error);
            res.status(404).send(util.ErrorMessages.UnexpectedError);
            return;
        }
    });
});
