// 'use strict';
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import fetch from 'cross-fetch';
// import * as admin from 'firebase-admin';
// import * as config from '../config/config';
// import * as functions from 'firebase-functions';

// const createMySubscription = async (req:functions.https.Request, res: functions.Response<any>) => {
//     const jsonString = req.headers['x-binu'] ?? '';
//     const binu = JSON.parse(Array.isArray(jsonString) ? jsonString[0] : jsonString);
//     const phoneNumber = binu.did;

//     const productId = 'productId';
//     const productIdIndex = req.url.indexOf(productId);
//     const productIdString = req.url.substring(productIdIndex+productId.length+1);

//     await admin.firestore().collection('users').where('phoneNumber', '==', binu.did).get()
//     .then((doc) => {
//         if (doc.empty) res.status(400).send('No user found');

//         const options = {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${config.MOYA_PAY_DEVELOPER_KEY}`,
//             },
//             body: JSON.stringify({
//                 amount: 100,
//                 username: phoneNumber,
//                 webhookUrl: '',
//             }),
//         };

//         fetch(config.MOYA_PAY_URL, options)
//         .then((result) => result.json())
//         .then(async (json) => {
//             await admin.firestore().collection('subscriptions').doc().set({
//             });
//         })
//         .catch((err) => {
//             console.error('error:' + err);
//             res.status(400).send(err);
//         });
//     })
//     .catch((error) => {
//         console.error('error:' + error);
//         res.status(400).send(error);
//     });
// };
