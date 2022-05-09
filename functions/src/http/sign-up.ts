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


            const ageNumber = Number(req.query.age);

            const ageMin = ageNumber - 5;
            const ageMax = ageNumber + 5;

            const gender = req.query.gender;

            const preference = [];

            if (req.query.lookingForMale) {
                preference.push('Male');
            }

            if (req.query.lookingForFemale) {
                preference.push('Female');
            }
            let genderPreference = 'Straight';

            if (preference.length == 1 && preference[0] == gender) genderPreference = 'Gay';


            await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).set({
                id: uid,
                bio: '',
                images: [],
                points: 0,
                age: ageNumber,
                name: req.query.name,
                gender: gender,
                location: req.query.location,
                isBanned: false,
                isVerified: false,
                hasPaidForChats: false,
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

            res.status(200).send(util.SuccessMessages.SuccessMessage);
            return;
        } catch (error) {
            console.error(util.ErrorMessages.ErrorText, error);
            res.status(404).send(util.ErrorMessages.UnexpectedExrror);
            return;
        }
    });
});