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

            const updateObject = {};

            if (req.query.ageMin != null) Object.assign(updateObject, { ageMin: req.query.ageMin });

            if (req.query.ageMax != null) Object.assign(updateObject, { ageMax: req.query.ageMax });

            if (req.query.gender != null) Object.assign(updateObject, { gender: req.query.gender });

            if (req.query.location != null) Object.assign(updateObject, { location: req.query.location });

            await admin.firestore().collection(util.FunctionsConstants.Preferences).doc(uid).update(updateObject);

            res.set('Content-Type', 'application/xml');
            res.status(200).send(util.SuccessMessages.SuccessMessage);
            return;
        } catch (error) {
            console.error(util.ErrorMessages.ErrorText, error);

            res.status(404).send(util.ErrorMessages.UnexpectedError);
            return;
        }
    });
});
