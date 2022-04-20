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


        const ageNumber = Number(req.query.age);

        const ageMin = ageNumber - 5;
        const ageMax = ageNumber + 5;

        admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).set({
            age: req.query.age,
            name: req.query.name,
            bio: '',
            gender: req.query.gender,
            images: [],
            isVerified: false,
            points: 0,
            verifiedPaymentsId: '',
            location: req.query.location,
        });

        admin.firestore().collection(util.FunctionsConstants.Preferences).doc(uid).set({
            gender: req.query.lookingFor,
            location: req.query.location,
            ageMin: ageMin.toString(),
            ageMax: ageMax.toString(),
        });

        res.status(200).send(util.SuccessMessages.SuccessMessage);
    } catch (error) {
        console.error(util.ErrorMessages.ErrorText, error);
        res.status(404).send(util.ErrorMessages.UnexpectedExrror);
    }
};

const getUserInformation = async (req:functions.https.Request, res: functions.Response) => {
    const jsonString = req.headers[util.FunctionsConstants.Xbinu] ?? '';
    const binu = JSON.parse(Array.isArray(jsonString) ? jsonString[0] : jsonString);
    const uid = binu.did;

    try {
        const userDocument = await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).get();

        if (!userDocument.exists) res.status(400).send(util.ErrorMessages.NoUserError);

        res.status(200).send(userDocument.data());
    } catch (error) {
        console.error(util.ErrorMessages.ErrorText, error);
        res.status(404).send(util.ErrorMessages.UnexpectedExrror);
    }
};

const updateUserInformation = async (req:functions.https.Request, res: functions.Response) => {
    try {
        const jsonString = req.headers[util.FunctionsConstants.Xbinu] ?? '';
        const binu = JSON.parse(Array.isArray(jsonString) ? jsonString[0] : jsonString);
        const uid = binu.did;

        const updateObject = {};

        if (req.query.age != null) Object.assign(updateObject, {age: req.query.age});

        if (req.query.bio != null) Object.assign(updateObject, {bio: req.query.bio});

        if (req.query.name != null) Object.assign(updateObject, {name: req.query.name});

        if (req.query.location != null) Object.assign(updateObject, {location: req.query.location});

        await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).update(updateObject);
        res.status(200).send(util.SuccessMessages.SuccessMessage);
    } catch (error) {
        console.error(util.ErrorMessages.ErrorText, error);
        res.status(404).send(util.ErrorMessages.UnexpectedExrror);
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

        const updateObject = {};

        if (req.query.ageMin != null) Object.assign(updateObject, {ageMin: req.query.ageMin});

        if (req.query.ageMax != null) Object.assign(updateObject, {ageMax: req.query.ageMax});

        if (req.query.gender != null) Object.assign(updateObject, {gender: req.query.gender});

        if (req.query.location != null) Object.assign(updateObject, {location: req.query.location});

        await admin.firestore().collection(util.FunctionsConstants.Preferences).doc(uid).update(updateObject);

        res.status(200).send(util.SuccessMessages.SuccessMessage);
    } catch (error) {
        console.error(util.ErrorMessages.ErrorText, error);
        res.status(404).send(util.ErrorMessages.UnexpectedExrror);
    }
};

export {
    signUp,
    getUserPreferences,
    getUserInformation,
    updateUserPreferences,
    updateUserInformation,
};
