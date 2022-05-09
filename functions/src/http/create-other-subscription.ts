import * as cors from 'cors';
import * as admin from 'firebase-admin';
import * as util from '../utils/constans';
import * as config from '../config/config';
import * as functions from 'firebase-functions';
const corsHandler = cors({origin: true});

export default functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        try {
            const queryUid = req.query.uid ?? '';
            const formattedUid = Array.isArray(queryUid) ? queryUid[0] : queryUid;
            const uidString = formattedUid.toString();


            const options = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.MOYA_PAY_DEVELOPER_KEY}`,
                },
                body: JSON.stringify({
                    amount: 1,
                    redirectUrl: '',
                    username: uidString,
                    webhookUrl: config.CALLBACK_URL,
                }),
            };

            fetch(config.MOYA_PAY_URL, options)
            .then((result) => result.json())
            .then(async (json) => {
               if (req.query.productId != util.Products.Chats) {
                   res.status(500).send(util.ErrorMessages.IncorrectProductId);
                   return;
                }

               await admin.firestore().collection(util.FunctionsConstants.Subscriptions).doc().set({
                purchaserId: uidString,
                isPaymentApproved: false,
                paymentId: json.paymentID,
                productId: req.query.productId,
            });


               res.status(200).send(util.SuccessMessages.SuccessMessage);
                return;
            });
        } catch (error) {
            console.error(util.ErrorMessages.ErrorText, error);

           res.status(404).send(util.ErrorMessages.UnexpectedExrror);
            return;
        }
    });
});
