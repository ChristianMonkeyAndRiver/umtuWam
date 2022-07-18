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

            const queryIsMale = req.query.lookingForMale ?? '';
            const formattedMale = Array.isArray(queryIsMale) ? queryIsMale[0] : queryIsMale;
            const isMale = formattedMale.toString();

            const queryIsFemale = req.query.lookingForFemale ?? '';
            const formattedFemale = Array.isArray(queryIsFemale) ? queryIsFemale[0] : queryIsFemale;
            const isFemale = formattedFemale.toString();

            const preference = [];

            if (isMale == '1') {
                preference.push('Male');
            }

            if (isFemale == '1') {
                preference.push('Female');
            }

            let genderPreference = 'Straight';

            const doc = await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).get();

            if (preference.length == 1 && preference[0] == doc.data()?.gender) {
                genderPreference = 'Gay';
                await doc.ref.update({ gender: genderPreference });
            }

            if (req.query.ageMin != null) Object.assign(updateObject, { ageMin: req.query.ageMin });

            if (req.query.ageMax != null) Object.assign(updateObject, { ageMax: req.query.ageMax });

            if (preference.length > 0) Object.assign(updateObject, { gender: preference });

            if (req.query.location != null) Object.assign(updateObject, { location: req.query.location });

            Object.assign(updateObject, { genderPreference: genderPreference });

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
