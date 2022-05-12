import * as admin from 'firebase-admin';
import * as util from '../utils/constans';
import * as functions from 'firebase-functions';
import { faker } from '@faker-js/faker';

export default functions.runWith({
    timeoutSeconds: 540,
    memory: '512MB',
}).https.onRequest(async (req, res) => {
    try {
        const userDocs = await admin.firestore().collection(util.FunctionsConstants.Users).limit(20).get();

        for (const doc of userDocs.docs) {
            for (const innerDoc of userDocs.docs) {
                const now = admin.firestore.Timestamp.now();
                await admin.firestore().collection(util.FunctionsConstants.Reports).doc().set({
                    reporterId: doc.id,
                    transgressorId: innerDoc.id,
                    title: faker.lorem.text(),
                    content: faker.lorem.paragraph(),
                    timestamp: now,
                });
            }
        }
        res.status(200).send(util.SuccessMessages.SuccessMessage);
        return;
    } catch (error) {
        console.error(util.ErrorMessages.ErrorText, error);
        res.status(404).send(util.ErrorMessages.UnexpectedExrror);
        return;
    }
});
