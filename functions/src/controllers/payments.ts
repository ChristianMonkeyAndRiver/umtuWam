'use strict';
/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch from 'cross-fetch';
import * as admin from 'firebase-admin';
import * as config from '../config/config';
import * as util from '../utils/constans';

import * as functions from 'firebase-functions';

const createMySubscription = async (req:functions.https.Request, res: functions.Response<any>) => {
   try {
        const jsonString = req.headers[util.FunctionsConstants.Xbinu] ?? '';
        const binu = JSON.parse(Array.isArray(jsonString) ? jsonString[0] : jsonString);
        const uid = binu.did;

        const uidIndex = req.url.indexOf(util.FunctionsConstants.Uid);
        const phoneNumberIndex = req.url.indexOf(util.FunctionsConstants.PhoneNumber);
        const productIdIndex = req.url.indexOf(util.FunctionsConstants.ProductId);
        let uidString = req.url.substring(uidIndex+util.FunctionsConstants.Uid.length+1, phoneNumberIndex-1);
        const phoneNumberString = req.url.substring(phoneNumberIndex+util.FunctionsConstants.PhoneNumber.length+1, productIdIndex-1);
        const productIdString = req.url.substring(productIdIndex+util.FunctionsConstants.ProductId.length+1);

        uidString = uidString.replace(util.FunctionsConstants.SpaceParsedValue, ' ');
        uidString = uidString.replace(util.FunctionsConstants.PlusSign, ' ');


        const userDocument = await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).get();

        if (!userDocument.exists) {
            res.status(400).send(util.ErrorMessages.NoUserError);
            return;
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.MOYA_PAY_DEVELOPER_KEY}`,
            },
            body: JSON.stringify({
                amount: 100,
                username: phoneNumberString,
                webhookUrl: config.CALLBACK_URL,
            }),
        };

        fetch(config.MOYA_PAY_URL, options)
        .then((result) => result.json())
        .then(async (json) => {
            await admin.firestore().collection(util.FunctionsConstants.Subscriptions).doc().set({
                paymentId: json.paymentID,
                product: productIdString,
            });

            const chatId = uid.concat('_').concat(uidString);
            console.log(chatId);

            if (productIdString == util.Products.Chats) {
                console.log(chatId);

                await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).collection(util.FunctionsConstants.Chats).doc(chatId)
                .update({
                    chatsPaymentID: json.paymentID,
                });
            } else if (productIdString == util.Products.Photos) {
                await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).collection(util.FunctionsConstants.Chats).doc(chatId)
                .update({
                    imagesPaymentID: json.paymentID,
                });
            } else if (productIdString == util.Products.Verified) {
                await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid)
                .update({
                    isVerified: true,
                    verifiedPaymentsId: json.paymentID,
                });
            } else if (productIdString == util.Products.Featured) {
                await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid)
                .update({
                    isFeatured: true,
                    verifiedFeaturedPaymentsId: json.paymentID,
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
};

const createOtherSubscription = async (req:functions.https.Request, res: functions.Response<any>) => {
    try {
         const jsonString = req.headers[util.FunctionsConstants.Xbinu] ?? '';
         const binu = JSON.parse(Array.isArray(jsonString) ? jsonString[0] : jsonString);
         const uid = binu.did;

         const uidIndex = req.url.indexOf(util.FunctionsConstants.Uid);
         const productIdIndex = req.url.indexOf(util.FunctionsConstants.ProductId);
         const phoneNumberIndex = req.url.indexOf(util.FunctionsConstants.PhoneNumber);
         let uidString = req.url.substring(uidIndex+util.FunctionsConstants.Uid.length+1, phoneNumberIndex-1);
         const phoneNumberString = req.url.substring(phoneNumberIndex+util.FunctionsConstants.PhoneNumber.length+1, productIdIndex-1);
         const productIdString = req.url.substring(productIdIndex+util.FunctionsConstants.ProductId.length+1);

         const userDocument = await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).get();

         uidString = uidString.replace(util.FunctionsConstants.SpaceParsedValue, ' ');
         uidString = uidString.replace(util.FunctionsConstants.PlusSign, ' ');


         if (!userDocument.exists) {
             res.status(400).send(util.ErrorMessages.NoUserError);
             return;
         }

         const options = {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${config.MOYA_PAY_DEVELOPER_KEY}`,
             },
             body: JSON.stringify({
                 amount: 100,
                 username: phoneNumberString,
                 webhookUrl: config.CALLBACK_URL,
             }),
         };

         fetch(config.MOYA_PAY_URL, options)
         .then((result) => result.json())
         .then(async (json) => {
             await admin.firestore().collection(util.FunctionsConstants.Subscriptions).doc().set({
                 paymentId: json.paymentID,
                 product: productIdString,
             });

             const chatId = uidString.concat('_').concat(uid);

             if (productIdString != util.Products.Chats) {
                res.status(400).send(util.ErrorMessages.IncorrectProductId);
                return;
             }

             await admin.firestore().collection(util.FunctionsConstants.Users).doc(uidString).collection(util.FunctionsConstants.Chats).doc(chatId)
             .update({
                 chatsPaymentID: json.paymentID,
             });
             res.status(200).send(util.SuccessMessages.SuccessMessage);
             return;
         });
     } catch (error) {
         console.error(util.ErrorMessages.ErrorText, error);
         res.status(404).send(util.ErrorMessages.UnexpectedExrror);
         return;
     }
 };

const subscriptionCallBackUrl = async (req:functions.https.Request, res: functions.Response<any>) => {
    try {
        const data = req.body;

        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.MOYA_PAY_DEVELOPER_KEY}`,
            },
        };

        // `${config.MOYA_PAY_URL}/payments/${data.paymentID}`
        fetch(`${config.MOYA_PAY_URL}/payments/${data.paymentID}`, options)
        .then((result) => result.json())
        .then(async (json) => {
            if (json.state != util.PaymentState.Accepted) {
                res.status(400).send(util.ErrorMessages.PaymentFailureError);
                return;
            }

            await admin.firestore().collection(util.FunctionsConstants.Subscriptions).where(util.FunctionsConstants.PaymentId, '==', json.paymentID)
            .get()
            .then(async (docs) => {
                if (docs.empty) {
                    res.status(400).send(util.ErrorMessages.SubscritionNotFound);
                    return;
                }

                const now = admin.firestore.Timestamp.now();
                const expiresAt = new admin.firestore.Timestamp(now.seconds + 24*60*60, now.nanoseconds);
                await admin.firestore().collection(util.FunctionsConstants.Subscriptions).doc(docs.docs[0].id).update({
                    expiryDate: expiresAt,
                });

                res.status(200).send(util.SuccessMessages.SuccessMessage);
                return;
            });
        });
    } catch (error) {
        console.error(util.ErrorMessages.ErrorText, error);
        res.status(404).send(util.ErrorMessages.UnexpectedExrror);
        return;
    }
};

const testPaymentsAPI = async (req:functions.https.Request, res: functions.Response<any>) => {
    res.status(200).send({
        'paymentID': '99955-87bb-4eaa-8eb5-a6c4a5006a88',
    });
    return;
};

const getPaymentAPI = async (req:functions.https.Request, res: functions.Response<any>) => {
    res.status(200).send({
        'state': 'ACCPETED',
        'paymentID': '99955-87bb-4eaa-8eb5-a6c4a5006a88',
    });
    return;
};

export {
    getPaymentAPI,
    testPaymentsAPI,
    createMySubscription,
    createOtherSubscription,
    subscriptionCallBackUrl,
};
