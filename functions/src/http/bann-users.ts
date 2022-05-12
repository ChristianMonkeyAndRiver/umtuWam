import * as admin from 'firebase-admin';
import * as util from '../utils/constans';
import * as functions from 'firebase-functions';

export default functions.runWith({
    timeoutSeconds: 540,
    memory: '512MB',
}).https.onRequest(async (req, res) => {
    try {
        const users = await admin.firestore().collection(util.FunctionsConstants.Users).limit(200).get();

        if (users.empty) {
            res.status(500).send(util.ErrorMessages.NoUserError);
            return;
        }

        for (const doc of users.docs) {
            doc.ref.set({
                isBanned: true,
            }, { merge: true });
        }

        res.status(200).send(util.SuccessMessages.SuccessMessage);
        return;
    } catch (error) {
        console.error(util.ErrorMessages.ErrorText, error);
        res.status(404).send(util.ErrorMessages.UnexpectedExrror);
        return;
    }
});
