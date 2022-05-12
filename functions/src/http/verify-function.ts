import * as admin from 'firebase-admin';
import * as util from '../utils/constans';
import * as functions from 'firebase-functions';
import { faker } from '@faker-js/faker';

export default functions.runWith({
    timeoutSeconds: 540,
    memory: '512MB',
}).https.onRequest(async (req, res) => {
    try {
        const users = await admin.firestore().collection(util.FunctionsConstants.Users).get();

        if (users.empty) {
            res.status(500).send(util.ErrorMessages.NoUserError);
            return;
        }

        for (const doc of users.docs) {
            const isVerified = (Math.floor(Math.random() * 2) == 0);


            if (isVerified) {
                const paymentId = faker.datatype.uuid();

                doc.ref.set({
                    isVerified: isVerified,
                    verifiedPaymentId: paymentId,
                }, { merge: true });
                const now = admin.firestore.Timestamp.now();
                const expiresAt = new admin.firestore.Timestamp(now.seconds + 24 * 60 * 60 * 100000, now.nanoseconds);
                admin.firestore().collection(util.FunctionsConstants.Subscriptions).doc().set({
                    purchaserId: doc.id,
                    paymentId: paymentId,
                    expiresAt: expiresAt,
                    product: util.Products.Verified,
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
