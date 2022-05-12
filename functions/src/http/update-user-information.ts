import * as cors from 'cors';
import * as admin from 'firebase-admin';
import * as util from '../utils/constans';
import * as functions from 'firebase-functions';

const corsHandler = cors({ origin: true });

export default functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        try {
            const queryId = req.query.id ?? '';
            const formattedId = Array.isArray(queryId) ? queryId[0] : queryId;
            const uid = formattedId.toString();

            const updateObject = {};

            if (req.query.age != null) Object.assign(updateObject, { age: req.query.age });

            if (req.query.bio != null) Object.assign(updateObject, { bio: req.query.bio });

            if (req.query.name != null) Object.assign(updateObject, { name: req.query.name });

            if (req.query.location != null) Object.assign(updateObject, { location: req.query.location });

            await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).update(updateObject);

            res.status(200).send(util.SuccessMessages.SuccessMessage);
            return;
        } catch (error) {
            console.error(util.ErrorMessages.ErrorText, error);

            res.status(404).send(util.ErrorMessages.UnexpectedExrror);
            return;
        }
    });
});
