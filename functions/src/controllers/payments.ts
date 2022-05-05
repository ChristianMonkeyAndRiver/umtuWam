'use strict';
/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch from 'cross-fetch';
import * as admin from 'firebase-admin';
import * as config from '../config/config';
import * as util from '../utils/constans';
import * as functions from 'firebase-functions';

import * as cors from 'cors';
const corsHandler = cors({origin: true});

function sleep(miliseconds:number) {
    const currentTime = new Date().getTime();

    // eslint-disable-next-line no-empty
    while (currentTime + miliseconds >= new Date().getTime()) {}
 }

const createMySubscription = async (req:functions.https.Request, res: functions.Response<any>) => {
    corsHandler(req, res, async () => {
        try {
            const queryId = req.query.id ?? '';
            const formattedId = Array.isArray(queryId) ? queryId[0] : queryId;
            const uid = formattedId.toString();

            const queryPhoneNumber = req.query.phoneNumber ?? '';
            const formattedPhoneNumber = Array.isArray(queryPhoneNumber) ? queryPhoneNumber[0] : queryPhoneNumber;
            const phoneNumber = formattedPhoneNumber.toString();

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
                    username: phoneNumber,
                    webhookUrl: config.CALLBACK_URL,
                }),
            };

            fetch(config.MOYA_PAY_URL, options)
            .then((result) => result.json())
            .then(async (json) => {
                if (req.query.productId == util.Products.Chats) {
                    const queryUid = req.query.uid ?? '';
                    const formattedUid = Array.isArray(queryUid) ? queryUid[0] : queryUid;
                    const uidString = formattedUid.toString();

                    await admin.firestore().collection(util.FunctionsConstants.Subscriptions).doc().set({
                        purchaserId: uid,
                        matchId: uidString,
                        paymentId: json.paymentID,
                        productId: req.query.productId,
                    });
                } else if (req.query.productId == util.Products.Photos) {
                    const queryUid = req.query.uid ?? '';
                    const formattedUid = Array.isArray(queryUid) ? queryUid[0] : queryUid;
                    const uidString = formattedUid.toString();
                    const id = uid.concat('_').concat(uidString);

                    await admin.firestore().collection(util.FunctionsConstants.Subscriptions).doc(id).set({
                        purchaserId: uid,
                        paymentId: json.paymentID,
                        productId: req.query.productId,
                    });
                } else {
                    await admin.firestore().collection(util.FunctionsConstants.Subscriptions).doc().set({
                        purchaserId: uid,
                        paymentId: json.paymentID,
                        productId: req.query.productId,
                    });
                }


                res.status(200).send(util.SuccessMessages.SuccessMessage);
                return;
            });
        } catch (error) {
            console.error(util.ErrorMessages.ErrorText, error);

            res.status(404).send(util.ErrorMessages.UnexpectedExrror);
            return;
        }
    });
};

const createOtherSubscription = async (req:functions.https.Request, res: functions.Response<any>) => {
    corsHandler(req, res, async () => {
        try {
            const queryId = req.query.id ?? '';
            const formattedId = Array.isArray(queryId) ? queryId[0] : queryId;
            const uid = formattedId.toString();

            const queryUid = req.query.uid ?? '';
            const formattedUid = Array.isArray(queryUid) ? queryUid[0] : queryUid;
            const uidString = formattedUid.toString();

            const queryPhoneNumber = req.query.phoneNumber ?? '';
            const formattedPhoneNumber = Array.isArray(queryPhoneNumber) ? queryPhoneNumber[0] : queryPhoneNumber;
            const phoneNumber = formattedPhoneNumber.toString();

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
                    username: phoneNumber,
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
                   matchId: uid,
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
 };

const subscriptionCallBackUrl = async (req:functions.https.Request, res: functions.Response<any>) => {
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
                    if (docs.docs[0].data().productId == util.Products.Chats) {
                        const chatId = docs.docs[0].data().purchaserId.concat('_').concat(docs.docs[0].data().matchId);

                        const promise1 = admin.firestore().collection(util.FunctionsConstants.Users).doc(docs.docs[0].data().purchaserId).collection(util.FunctionsConstants.Chats).doc(chatId)
                        .set({
                            chatsPaymentID: json.paymentID,
                        }, {merge: true});

                        promises.push(promise1);

                        const now = admin.firestore.Timestamp.now();
                        const expiresAt = new admin.firestore.Timestamp(now.seconds + 24*60*60, now.nanoseconds);
                        const promise2 = docs.docs[0].ref.update({expiresAt: expiresAt});
                        promises.push(promise2);
                    } else if (docs.docs[0].data().productId == util.Products.Photos) {
                        const now = admin.firestore.Timestamp.now();
                        const expiresAt = new admin.firestore.Timestamp(now.seconds + 24*60*60*100000, now.nanoseconds);
                        const promise2 = docs.docs[0].ref.update({expiresAt: expiresAt});
                        promises.push(promise2);
                    } else if (docs.docs[0].data().productId == util.Products.Verified) {
                        const promise1 = admin.firestore().collection(util.FunctionsConstants.Users).doc(docs.docs[0].data().purchaserId)
                        .update({
                            isVerified: true,
                            verifiedPaymentId: json.paymentID,
                        });

                        promises.push(promise1);

                        const now = admin.firestore.Timestamp.now();
                        const expiresAt = new admin.firestore.Timestamp(now.seconds + 24*60*60*100000, now.nanoseconds);
                        const promise2 = docs.docs[0].ref.update({expiresAt: expiresAt});
                        promises.push(promise2);
                    } else if (docs.docs[0].data().productId == util.Products.Featured) {
                        const promise1 = admin.firestore().collection(util.FunctionsConstants.Users).doc(docs.docs[0].data().purchaserId)
                        .update({
                            points: 10,
                            featuredPaymentId: json.paymentID,
                        });

                        promises.push(promise1);

                        const now = admin.firestore.Timestamp.now();
                        const expiresAt = new admin.firestore.Timestamp(now.seconds + 24*60*60, now.nanoseconds);
                        const promise2 = docs.docs[0].ref.update({expiresAt: expiresAt});
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
};

const testFindUser = async (req:functions.https.Request, res: functions.Response<any>) => {
    try {
        const options = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer kPzzGQ-zipQ-V-m_7uwLpgwfLiY40xap_LJnG8EF5TwwEG--ixj5A_fohjgqmoGd',
          },
        };

        fetch('https://api.moya.app/v1/users/27727888675', options)
        .then((result) => result.json())
        .then((json) => {
            console.log(json.user_profile.did);
          res.status(200).send(json);
          return;
        });
      } catch (error) {
        console.error(util.ErrorMessages.ErrorText, error);

        res.status(404).send(util.ErrorMessages.UnexpectedExrror);
        return;
      }
};

export {
    testFindUser,
    createMySubscription,
    createOtherSubscription,
    subscriptionCallBackUrl,
};
