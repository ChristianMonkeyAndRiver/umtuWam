import * as cors from 'cors';
import * as admin from 'firebase-admin';
import * as util from '../utils/constans';
import * as config from '../config/config';
import * as functions from 'firebase-functions';
const corsHandler = cors({origin: true});

function sleep(miliseconds:number) {
    const currentTime = new Date().getTime();

    // eslint-disable-next-line no-empty
    while (currentTime + miliseconds >= new Date().getTime()) {}
}

export default functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        try {
            const data = req.body;

            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.MOYA_PAY_DEVELOPER_KEY}`,
                },
            };

            sleep(3000);

            fetch(`${config.MOYA_PAY_URL}${data.paymentID}`, options)
            .then((result) => result.json())
            .then(async (json) => {
                if (json.state != util.PaymentState.Approved) {
                    admin.firestore().collection(util.FunctionsConstants.Subscriptions).where(util.FunctionsConstants.PaymentId, '==', json.paymentID)
                    .get()
                    .then(async (docs) => {
                        await docs.docs[0].ref.delete();
                    });
                    res.status(500).send(util.ErrorMessages.PaymentFailureError);
                    return;
                }

                admin.firestore().collection(util.FunctionsConstants.Subscriptions).where(util.FunctionsConstants.PaymentId, '==', json.paymentID)
                .get()
                .then(async (docs) => {
                    if (docs.empty) {
                        res.status(500).send(util.ErrorMessages.SubscritionNotFound);
                        return;
                    }
                    const promises = [];
                    if (docs.docs[0].data().productId == util.Products.Chats || docs.docs[0].data().productId == util.Products.Boost) {
                        const now = admin.firestore.Timestamp.now();
                        const expiresAt = new admin.firestore.Timestamp(now.seconds + 24*60*60, now.nanoseconds);
                        if (docs.docs[0].data().productId == util.Products.Boost) {
                            const promise1 = admin.firestore().collection(util.FunctionsConstants.Users).doc(docs.docs[0].data().purchaserId)
                            .update({
                                points: 10,
                                hasPaidForFeatured: true,
                                featuredExpiryDate: expiresAt,
                            });
                            promises.push(promise1);
                        } else {
                            const promise1 = admin.firestore().collection(util.FunctionsConstants.Users).doc(docs.docs[0].data().purchaserId)
                            .update({
                                hasPaidForChats: true,
                                chatsExpiryDate: expiresAt,
                            });
                            promises.push(promise1);
                        }
                        const promise2 = docs.docs[0].ref.update({expiresAt: expiresAt, isPaymentApproved: true});
                        promises.push(promise2);
                    } else {
                        if (docs.docs[0].data().productId == util.Products.Verified) {
                            const promise1 = admin.firestore().collection(util.FunctionsConstants.Users).doc(docs.docs[0].data().purchaserId)
                            .update({
                                isVerified: true,
                            });
                            promises.push(promise1);
                        }

                        const now = admin.firestore.Timestamp.now();
                        const expiresAt = new admin.firestore.Timestamp(now.seconds + 24*60*60*100000, now.nanoseconds);
                        const promise2 = docs.docs[0].ref.update({expiresAt: expiresAt, isPaymentApproved: true});
                        promises.push(promise2);
                    }

                    await Promise.all(promises);
                    res.status(200).send(util.SuccessMessages.SuccessMessage);
                    return;
                });
            });
        } catch (error) {
            console.error(util.ErrorMessages.ErrorText, error);
            res.status(404).send(util.ErrorMessages.UnexpectedExrror);
            return;
        }
    });
});