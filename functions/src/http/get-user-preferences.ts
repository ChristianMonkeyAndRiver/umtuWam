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

            const userPreferencesDoc = await admin.firestore().collection(util.FunctionsConstants.Preferences).doc(uid).get();

            if (!userPreferencesDoc.exists) res.status(500).send(util.ErrorMessages.NoUserError);


            res.status(200).send(userPreferencesDoc.data());
            return;
        } catch (error) {
            console.error(util.ErrorMessages.ErrorText, error);

            res.status(404).send(util.ErrorMessages.UnexpectedExrror);
            return;
        }
    });
});
