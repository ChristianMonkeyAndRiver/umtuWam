/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import * as admin from 'firebase-admin';
import * as util from '../utils/constans';
import * as functions from 'firebase-functions';

const signUp = async (req:functions.https.Request, res: functions.Response) => {
    try {
        const jsonString = req.headers[util.FunctionsConstants.Xbinu] ?? '';
        const binu = JSON.parse(Array.isArray(jsonString) ? jsonString[0] : jsonString);
        const uid = binu.did;

        const nameIndex = req.url.indexOf(util.FunctionsConstants.Name);
        const genderIndex = req.url.indexOf(util.FunctionsConstants.Gender);
        const lookingForIndex = req.url.indexOf(util.FunctionsConstants.LookingFor);
        const ageIndex = req.url.indexOf(util.FunctionsConstants.Age);
        const locationIndex = req.url.indexOf(util.FunctionsConstants.Location);

        const nameString = req.url.substring(nameIndex+util.FunctionsConstants.Name.length+1, genderIndex-1);

        const genderString = req.url.substring(genderIndex+util.FunctionsConstants.Gender.length+1, lookingForIndex-1);

        const lookingForString = req.url.substring(lookingForIndex+util.FunctionsConstants.LookingFor.length+1, ageIndex-1);

        const ageString = req.url.substring(ageIndex+util.FunctionsConstants.Age.length+1, locationIndex-1);

        const locationString = req.url.substring(locationIndex+util.FunctionsConstants.Location.length+1);

        const ageNumber = Number(ageString);

        const ageMin = ageNumber - 5;
        const ageMax = ageNumber + 5;

        admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).set({
            age: ageString,
            name: nameString,
            bio: '',
            gender: genderString,
            images: [],
            isVerified: false,
            verifiedPaymentsId: '',
            location: locationString,
        });

        admin.firestore().collection(util.FunctionsConstants.Preferences).doc(uid).set({
            gender: lookingForString,
            location: locationString,
            ageMin: ageMin.toString(),
            ageMax: ageMax.toString(),
        });

        res.status(200).send(util.SuccessMessages.SuccessMessage);
        return;
    } catch (error) {
        console.error(util.ErrorMessages.ErrorText, error);
        res.status(404).send(util.ErrorMessages.UnexpectedExrror);
        return;
    }
};

const getUserInformation = async (req:functions.https.Request, res: functions.Response) => {
    const jsonString = req.headers[util.FunctionsConstants.Xbinu] ?? '';
    const binu = JSON.parse(Array.isArray(jsonString) ? jsonString[0] : jsonString);
    const uid = binu.did;

    try {
        const userDocument = await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).get();

        if (!userDocument.exists) {
            res.status(400).send(util.ErrorMessages.NoUserError);
            return;
        }

        res.status(200).send(userDocument.data());
        return;
    } catch (error) {
        console.error(util.ErrorMessages.ErrorText, error);
        res.status(404).send(util.ErrorMessages.UnexpectedExrror);
        return;
    }
};

const updateUserInformation = async (req:functions.https.Request, res: functions.Response) => {
    try {
        const jsonString = req.headers[util.FunctionsConstants.Xbinu] ?? '';
        const binu = JSON.parse(Array.isArray(jsonString) ? jsonString[0] : jsonString);
        const uid = binu.did;

        const nameIndex = req.url.indexOf(util.FunctionsConstants.Name);
        const ageIndex = req.url.indexOf(util.FunctionsConstants.Age);
        const locationIndex = req.url.indexOf(util.FunctionsConstants.Location);
        const bioIndex = req.url.indexOf(util.FunctionsConstants.Bio);
        const lookingForIndex = req.url.indexOf(util.FunctionsConstants.LookingFor);

        const nameString = req.url.substring(nameIndex+util.FunctionsConstants.Name.length+1, ageIndex-1);

        const ageString = req.url.substring(ageIndex+util.FunctionsConstants.Age.length+1, locationIndex-1);

        const locationString = req.url.substring(locationIndex+util.FunctionsConstants.Location.length+1, bioIndex-1);

        const bioString = req.url.substring(bioIndex+util.FunctionsConstants.Bio.length+1, lookingForIndex-1);

        const lookingForString = req.url.substring(lookingForIndex+util.FunctionsConstants.LookingFor.length+1);

        const userDocument = await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).get();

        if (!userDocument.exists) {
            res.status(400).send(util.ErrorMessages.NoUserError);
            return;
        }

        await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).update({
            age: ageString == '-1' ? userDocument.data()?.age : ageString,
            bio: bioString == '-1' ? userDocument.data()?.bio : bioString,
            name: nameString == '-1' ? userDocument.data()?.name : nameString,
            location: locationString == '-1' ? userDocument.data()?.location : locationString,
            lookingFor: lookingForString == '-1' ? userDocument.data()?.lookingFor : lookingForString,
        });
    } catch (error) {
        console.error(util.ErrorMessages.ErrorText, error);
        res.status(404).send(util.ErrorMessages.UnexpectedExrror);
        return;
    }
};

const getUserPreferences = async (req:functions.https.Request, res: functions.Response) => {
    try {
        const jsonString = req.headers[util.FunctionsConstants.Xbinu] ?? '';
        const binu = JSON.parse(Array.isArray(jsonString) ? jsonString[0] : jsonString);
        const uid = binu.did;

        const userPreferencesDoc = await admin.firestore().collection(util.FunctionsConstants.Preferences).doc(uid).get();

        if (!userPreferencesDoc.exists) {
            res.status(400).send(util.ErrorMessages.NoUserError);
            return;
        }

        res.status(200).send(userPreferencesDoc.data());
        return;
    } catch (error) {
        console.error(util.ErrorMessages.ErrorText, error);
        res.status(404).send(util.ErrorMessages.UnexpectedExrror);
        return;
    }
};

const updateUserPreferences = async (req:functions.https.Request, res: functions.Response) => {
    try {
        const jsonString = req.headers[util.FunctionsConstants.Xbinu] ?? '';
        const binu = JSON.parse(Array.isArray(jsonString) ? jsonString[0] : jsonString);
        const uid = binu.did;

        const ageMinIndex = req.url.indexOf(util.FunctionsConstants.AgeMin);
        const ageMaxIndex = req.url.indexOf(util.FunctionsConstants.AgeMax);
        const genderIndex = req.url.indexOf(util.FunctionsConstants.Gender);
        const locationIndex = req.url.indexOf(util.FunctionsConstants.Location);

        const ageMinString = req.url.substring(ageMinIndex+util.FunctionsConstants.AgeMin.length+1, ageMaxIndex-1);

        const ageMaxString = req.url.substring(ageMaxIndex+util.FunctionsConstants.AgeMax.length+1, genderIndex-1);

        const genderString = req.url.substring(genderIndex+util.FunctionsConstants.Gender.length+1, locationIndex-1);

        const locationString = req.url.substring(locationIndex+util.FunctionsConstants.Location.length+1);

        const userPreferenceDocument = await admin.firestore().collection(util.FunctionsConstants.Preferences).doc(uid).get();

        if (!userPreferenceDocument.exists) {
            res.status(400).send(util.ErrorMessages.NoUserError);
            return;
        }

        await admin.firestore().collection(util.FunctionsConstants.Preferences).doc(uid).update({
            ageMin: ageMinString == '-1' ? userPreferenceDocument.data()?.ageMax : ageMinString,
            ageMax: ageMaxString == '-1' ? userPreferenceDocument.data()?.ageMax : ageMaxString,
            gender: genderString == '-1' ? userPreferenceDocument.data()?.gender : genderString,
            location: locationString == '-1' ? userPreferenceDocument.data()?.location : locationString,
        });
    } catch (error) {
        console.error(util.ErrorMessages.ErrorText, error);
        res.status(404).send(util.ErrorMessages.UnexpectedExrror);
        return;
    }
};

export {
    signUp,
    getUserPreferences,
    getUserInformation,
    updateUserPreferences,
    updateUserInformation,
};
