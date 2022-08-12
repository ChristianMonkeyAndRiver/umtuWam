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

            const queryIsMale = req.query.lookingForMale ?? '';
            const formattedMale = Array.isArray(queryIsMale) ? queryIsMale[0] : queryIsMale;
            const isMale = formattedMale.toString();

            const queryIsFemale = req.query.lookingForFemale ?? '';
            const formattedFemale = Array.isArray(queryIsFemale) ? queryIsFemale[0] : queryIsFemale;
            const isFemale = formattedFemale.toString();

            const ageNumber = Number(req.query.age);

            const ageMin = ageNumber - 5;
            const ageMax = ageNumber + 5;

            const gender = req.query.gender;

            const preference = [];

            if (isMale == '1') {
                preference.push('Male');
            }

            if (isFemale == '1') {
                preference.push('Female');
            }
            let genderPreference = 'Straight';

            if (preference.length == 1 && preference[0] == gender) genderPreference = 'Gay';

            const now = admin.firestore.Timestamp.now();

            await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).set({
                id: uid,
                bio: '',
                images: [],
                points: 0,
                age: ageNumber,
                name: req.query.name,
                gender: gender,
                reports: 0,
                location: req.query.location,
                isBanned: false,
                isVerified: false,
                hasPaidForChatsAndPhotos: false,
                featuredExpiryDate: now,
                chatsAndPhotosExpiryDate: now,
                hasPaidForFeatured: false,
                genderPreference: genderPreference,
            });

            await admin.firestore().collection(util.FunctionsConstants.Preferences).doc(uid).set({
                currentIndex: '',
                ageMin: ageMin.toString(),
                ageMax: ageMax.toString(),
                genderPreference: genderPreference,
                gender: preference,
                location: req.query.location,
            });

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
