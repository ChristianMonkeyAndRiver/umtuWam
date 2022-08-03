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

            const queryPin = req.query.pin ?? '';
            const formattedPin = Array.isArray(queryPin) ? queryPin[0] : queryPin;
            const voucherPin = formattedPin.toString();


            const queryAmount = req.query.amount ?? '';
            const formattedAmount = Array.isArray(queryAmount) ? queryAmount[0] : queryAmount;
            const amount = formattedAmount.toString();

            const randomKey = Math.random().toString().substr(2, 10);
            const requestId = 'RID-'+randomKey;

            const userIdRandomKey = Math.random().toString().substr(2, 10);
            const userId = 'TID-'+userIdRandomKey;

            const testDocIdNum = Math.random().toString().substr(2, 10);
            const docId = 'Test-Gift-'+testDocIdNum;
            const options = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.FLASH_SANDBOX_TOKEN}`,
                },
                body: JSON.stringify({
                    requestId: requestId,
                    voucherPin: voucherPin,
                    userId: userId,
                    amount: amount,
                    customerContact: {
                        mechanism: 'SMS',
                        address: id,
                      },
                      acquirer: {
                        account: {
                          accountNumber: config.FLASH_ACCOUNT_NUMBER,
                        },
                        entityTag: req.query.productId,
                    },
                }),
            };

            fetch(config.FLASH_TEST_URL, options)
            .then((result) => result.json())
            .then(async (json) => {
                if (json.responseCode != null && json.responseCode == 0) {
                    const now = admin.firestore.Timestamp.now();
                    const expiresAt = new admin.firestore.Timestamp(now.seconds + 24 * 60 * 60, now.nanoseconds);

                    await admin.firestore().collection(util.FunctionsConstants.Subscriptions).doc(docId).set({
                        isGift: true,
                        purchaserId: id,
                        recipientId: uid,
                        isPaymentApproved: false,
                        paymentId: json.transactionId,
                        expiresAt: expiresAt,
                        productId: req.query.productId,
                    });

                    await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid)
                    .update({
                        hasPaidForChatsAndPhotos: true,
                        chatsAndPhotosExpiryDate: expiresAt,
                    });
                    res.status(200).send(json);
                } else if (json.responseCode != null) {
                    console.error(util.ErrorMessages.ErrorText, json.responseMessage);
                    switch (json.responseCode) {
                            case 1821:
                                res.status(404).send({ 'responseMessage': 'Voucher not found' });
                                break;
                            case 1822:
                                res.status(404).send({ 'responseMessage': 'Voucher expired' });
                                break;
                            case 1823:
                                res.status(404).send({ 'responseMessage': 'Voucher cancelled' });
                                break;
                            case 1824:
                                res.status(404).send({ 'responseMessage': 'Voucher has already been redeemed.' });
                                break;
                            case 2400:
                                res.status(404).send({ 'responseMessage': 'Error occurred within the 1ForYou  system. Please try again.' });
                                break;
                            case 2401:
                                res.status(404).send({ 'responseMessage': 'Error, the voucher you entered has already been used.' });
                                break;
                            case 2402:
                                res.status(404).send({ 'responseMessage': 'Error, the voucher you entered could not be found.' });
                                break;
                            default:
                                res.status(500).send({ 'responseMessage': util.ErrorMessages.UnexpectedError });
                        }
                } else if (res.statusCode >= 400) {
                    console.error(util.ErrorMessages.ErrorText, json);
                    res.status(404).send(util.ErrorMessages.UnexpectedError);
                }
                return;
            });
        } catch (error) {
            console.error(util.ErrorMessages.ErrorText, error);
            res.status(404).send(util.ErrorMessages.UnexpectedError);
            return;
        }
    });
});


