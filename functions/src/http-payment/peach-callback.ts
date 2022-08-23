/* eslint-disable @typescript-eslint/no-explicit-any */
import * as xml from 'xml';
import * as cors from 'cors';
import * as https from 'https';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as util from '../utils/constants';
import { sendMoyaMessageAfterSubscriptionHasBeenBought, sendMoyaMessageAfterSubscriptionHasBeenBoughtForSomeoneElse } from '../utils/messaging_api';

const corsHandler = cors({ origin: true });

export default functions.https.onRequest(async (req, res) => {
    const queryCheckoutId = req.query.checkoutId ?? '';
    const formattedCheckoutId = Array.isArray(queryCheckoutId) ? queryCheckoutId[0] : queryCheckoutId;
    const checkoutId = formattedCheckoutId.toString();

    const queryId = req.query.id ?? '';
    const formattedId = Array.isArray(queryId) ? queryId[0] : queryId;
    const id = formattedId.toString();

    const queryUid = req.query.uid ?? '';
    const formattedUid = Array.isArray(queryUid) ? queryUid[0] : queryUid;
    const uid = formattedUid.toString();

    const queryProduct = req.query.product ?? '';
    const formattedProduct = Array.isArray(queryProduct) ? queryProduct[0] : queryProduct;
    const productId = formattedProduct.toString();

    const queryIsMine = req.query.isMine ?? '';
    const formattedIsMine = Array.isArray(queryIsMine) ? queryIsMine[0] : queryIsMine;
    const isMine = formattedIsMine.toString();

    corsHandler(req, res, async () => {
        const request = async () => {
            let path=`/v1/checkouts/${checkoutId}/payment`;
            path += '?entityId=8ac7a4c981a409ed0181a5ce03740312';
            const options = {
                port: 443,
                host: 'eu-test.oppwa.com',
                path: path,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer OGFjN2E0Y2E4MWE0MTNmMjAxODFhNWNkZmYyNjA1MjB8WENaUVRlRDVOWQ==',
                },
            };
            return new Promise((resolve, reject) => {
                const postRequest = https.request(options, function(res) {
                    const buf: any[] = [];
                    res.on('data', (chunk) => {
                        buf.push(Buffer.from(chunk));
                    });
                    res.on('end', () => {
                        const jsonString = Buffer.concat(buf).toString('utf8');
                        try {
                            resolve(JSON.parse(jsonString));
                        } catch (error) {
                            reject(error);
                        }
                    });
                });
                postRequest.on('error', reject);
                postRequest.end();
            });
        };

        try {
            const result = await request();
            const json: any = result;

            const paymentDescription = json.result.description;
            const now = admin.firestore.Timestamp.now();
            const expiresAt = new admin.firestore.Timestamp(now.seconds + 24 * 60 * 60, now.nanoseconds);
            const promises = [];

            if (resultCodes.includes(json.result.code)) {
                if (isMine == 'true') {
                    const promise1 = admin.firestore().collection(util.FunctionsConstants.Subscriptions).doc('Test Id Purchase Peach').set({
                        isGift: false,
                        purchaserId: id,
                        isPaymentApproved: true,
                        paymentId: json.id,
                        productId: productId,
                        expiresAt: expiresAt,
                    });
                    promises.push(promise1);

                    if (productId == util.Products.Boost) {
                        const promise2 = admin.firestore().collection(util.FunctionsConstants.Users).doc(id)
                            .update({
                                points: 10,
                                hasPaidForFeatured: true,
                                featuredExpiryDate: expiresAt,
                            });
                        promises.push(promise2);
                    } else if (productId == util.Products.ChatsAndPhotos) {
                        const promise2 = admin.firestore().collection(util.FunctionsConstants.Users).doc(id)
                            .update({
                                hasPaidForChatsAndPhotos: true,
                                chatsAndPhotosExpiryDate: expiresAt,
                            });
                        promises.push(promise2);
                    } else if (productId == util.Products.Verified) {
                        const promise2 = admin.firestore().collection(util.FunctionsConstants.Users).doc(id)
                            .update({
                                isVerified: true,
                            });
                        promises.push(promise2);
                    }

                    console.log('--------------------------------');
                    console.log(id);
                    console.log('--------------------------------');
                    const promise3 = sendMoyaMessageAfterSubscriptionHasBeenBought(id, productId);
                    promises.push(promise3);
                } else {
                    const promise1 = admin.firestore().collection(util.FunctionsConstants.Subscriptions).doc('Test Id Purchase Peach').set({
                        isGift: false,
                        purchaserId: id,
                        recipientId: uid,
                        isPaymentApproved: true,
                        paymentId: json.id,
                        productId: productId,
                        expiresAt: expiresAt,
                    });
                    promises.push(promise1);

                    const promise2 = admin.firestore().collection(util.FunctionsConstants.Users).doc(uid)
                            .update({
                                hasPaidForChatsAndPhotos: true,
                                chatsAndPhotosExpiryDate: expiresAt,
                            });
                    promises.push(promise2);
                    const promise3 = sendMoyaMessageAfterSubscriptionHasBeenBoughtForSomeoneElse(uid);
                    promises.push(promise3);
                }
            } else {
                const doc = createResponseDocument(paymentDescription);
                res.status(200).send(xml(doc, { declaration: { standalone: 'yes', encoding: 'UTF-8' } }));
                return;
            }
            const doc = createResponseDocument('Your Payment Has Completed Successful');
            await Promise.all(promises);

            res.status(200).send(xml(doc, { declaration: { standalone: 'yes', encoding: 'UTF-8' } }));
            return;
        } catch (error) {
            console.error(error);
            const doc = createResponseDocument(error);
            res.status(404).send(xml(doc, { declaration: { standalone: 'yes', encoding: 'UTF-8' } }));
            return;
        }
    });
});

function createResponseDocument(message: any) {
    const doc = [{
        doc: [
            {
                _attr: {
                    title: 'Status',
                },
            },
            {
                list: [
                    {
                        item: [
                            {
                                _attr: {
                                    style: '',
                                    layout: 'relative',
                                },
                            },
                            {
                                md: `## ${message}`,
                            },
                        ],
                    },
                ],
            },
        ],
    }];

    return doc;
}

const resultCodes = [
    '000.000.000',
    '000.000.100',
    '000.100.105',
    '000.100.106',
    '000.100.110',
    '000.100.111',
    '000.100.112',
    '000.300.000',
    '000.300.100',
    '000.300.101',
    '000.300.102',
    '000.300.103',
    '000.310.100',
    '000.310.101',
    '000.310.110',
    '000.600.000',
    '000.400.000',
    '000.400.010',
    '000.400.020',
    '000.400.040',
    '000.400.050',
    '000.400.060',
    '000.400.070',
    '000.400.080',
    '000.400.081',
    '000.400.082',
    '000.400.090',
    '000.400.091',
    '000.400.100',
    '000.400.110',
];
