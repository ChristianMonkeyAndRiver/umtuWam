import * as cors from 'cors';
import fetch from 'cross-fetch';
import * as admin from 'firebase-admin';
import * as util from '../utils/constants';
import * as config from '../config/config';
import * as functions from 'firebase-functions';
const corsHandler = cors({ origin: true });

export default functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        try {
            const queryId = req.query.id ?? '';
            const formattedId = Array.isArray(queryId) ? queryId[0] : queryId;
            const id = formattedId.toString();

            const queryUid = req.query.uid ?? '';
            const formattedUid = Array.isArray(queryUid) ? queryUid[0] : queryUid;
            const uid = formattedUid.toString();

            const queryAmount = req.query.amount ?? '';
            const formattedAmount = Array.isArray(queryAmount) ? queryAmount[0] : queryAmount;
            const amount = formattedAmount.toString();

            const options = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.MOYA_PAY_DEVELOPER_KEY}`,
                },
                body: JSON.stringify({
                    amount: parseInt(amount),
                    redirectUrl: '',
                    username: id,
                    webhookUrl: config.CALLBACK_URL,
                }),
            };

            fetch(config.MOYA_PAY_URL, options)
                .then((result) => result.json())
                .then(async (json) => {
                    await admin.firestore().collection(util.FunctionsConstants.Subscriptions).doc().set({
                        isGift: true,
                        purchaserId: id,
                        recipientId: uid,
                        isPaymentApproved: false,
                        paymentId: json.paymentID,
                        productId: req.query.productId,
                    });
                    res.set('Content-Type', 'application/xml');
                    res.status(200).send(util.SuccessMessages.SuccessMessage);
                    return;
                });
        } catch (error) {
            console.error(error);
            res.status(404).send(util.ErrorMessages.UnexpectedError);
            return;
        }
    });
});
