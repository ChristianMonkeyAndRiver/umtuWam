import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as appController from './controllers/app';
import * as testController from './utils/testData';
import * as userController from './controllers/user';
import * as chatsController from './controllers/chats';
import * as paymentsController from './controllers/payments';

admin.initializeApp();


// =====================================================================================================================

exports.signUp = functions.https.onRequest(userController.signUp);

exports.getUserInformation = functions.https.onRequest(userController.getUserInformation);

exports.updateUserInformation = functions.https.onRequest(userController.updateUserInformation);

exports.getUserPreferences = functions.https.onRequest(userController.getUserPreferences);

exports.updateUserPreferences = functions.https.onRequest(userController.updateUserPreferences);

// =====================================================================================================================

exports.getApp = functions.https.onRequest(appController.getAppXML);

exports.getUserProfileXML = functions.https.onRequest(appController.getUserProfileXML);

exports.getProspectiveDates = functions.https.onRequest(appController.getProspectiveDates);

exports.getMembershipPageXML = functions.https.onRequest(appController.getMembershipPageXML);

exports.getProspectiveDatesXML = functions.https.onRequest(appController.getProspectiveDatesXML);

// =====================================================================================================================

exports.getChat = functions.https.onRequest(chatsController.getChat);

exports.likeUser = functions.https.onRequest(chatsController.likeUser);

exports.getMatches = functions.https.onRequest(chatsController.getMatches);

exports.getMatchesXML = functions.https.onRequest(chatsController.getMatchesXML);

exports.sendMessage = functions.https.onRequest(chatsController.sendMessage);

// =====================================================================================================================

exports.createMySubscription = functions.https.onRequest(paymentsController.createMySubscription);

exports.createMySubscription = functions.https.onRequest(paymentsController.createOtherSubscription);

exports.subscriptionCallBackUrl = functions.https.onRequest(paymentsController.subscriptionCallBackUrl);

// =====================================================================================================================

exports.addTestUsers = functions.https.onRequest(testController.addTestUsers);

exports.addTestChatsUsers = functions.https.onRequest(testController.addTestChatsUsers);

// =====================================================================================================================

// ============================================= Logos ============================================= //
// umtuWam logo with background - https://firebasestorage.googleapis.com/v0/b/umtuwam.appspot.com/o/logos%2FUmtuWam%20Logo.jpeg?alt=media&token=f6389109-0137-4b7a-a452-4a23f137862a
// umtuWam logo small with background - https://firebasestorage.googleapis.com/v0/b/umtuwam.appspot.com/o/logos%2FUmtuWam%20small%20logo.jpeg?alt=media&token=180b987f-7aad-4f41-aceb-260e9fd48aa2
// umtuWam logo without background - https://firebasestorage.googleapis.com/v0/b/umtuwam.appspot.com/o/logos%2Flogo.png?alt=media&token=4fc9ed08-3832-4727-a2aa-717cda834193
// umtuWam logo small with background - https://firebasestorage.googleapis.com/v0/b/umtuwam.appspot.com/o/logos%2Flogo_small.png?alt=media&token=79be9e23-879d-4778-99fe-cf155076c183


// ============================================= Http Links ============================================= //
// getChat - https://us-central1-umtuwam.cloudfunctions.net/getChat
// getChats - https://us-central1-umtuwam.cloudfunctions.net/getChats
// getPreferences - https://us-central1-umtuwam.cloudfunctions.net/getPreferences
// getPropectiveDates - https://us-central1-umtuwam.cloudfunctions.net/getPropectiveDates
// likeUser - https://us-central1-umtuwam.cloudfunctions.net/likeUser
// sendMessage - https://us-central1-umtuwam.cloudfunctions.net/sendMessage
// updatePreferences - https://us-central1-umtuwam.cloudfunctions.net/updatePreferences
// updateUser - https://us-central1-umtuwam.cloudfunctions.net/updateUser
// uploadImages - https://us-central1-umtuwam.cloudfunctions.net/uploadImages


// const bucket = admin.storage().bucket();
// const imageBuffer = Buffer.from(data.imageBytes64Str, 'base64');
// const imageByteArray = new Uint8Array(imageBuffer);
// const file = bucket.file(`images/users/${data.userId}/profile_photo_${imageArrayLength}.jpg`);
// const options = {resumable: false, metadata: {contentType: 'image/jpg'}};

// await file.save(imageByteArray.toString(), options)
// .then(() => {
//     return file.getSignedUrl({
//         action: 'read',
//         expires: '03-09-2500',
//         });
// })
// .then(async (urls) => {
//     const url = urls[0];
//     console.log(`Image url = ${url}`);
//     await admin.firestore().collection(util.FunctionsConstants.Users).doc(data.userId).update({
//         images: admin.firestore.FieldValue.arrayUnion(url),
//     }).catch((error) => {
//         return res.status(400).send(error);
//     });
//     return res.status(200).send({
//         'imageUrl': url,
//     });
// })
// .catch((error) => {
//     return res.status(400).send(error);
// });


// exports.uploadImages = functions.https.onRequest(async (req, res) => {
//     const data = req.body;

//     await admin.firestore().collection(util.FunctionsConstants.Users).doc(data.userId).get()
//     .then(async (doc) => {
//         if (!doc.exists) return res.status(400).send(util.ErrorMessages.NoUserError);

//         if (doc.data()?.images.length == 5) return res.status(400).send(util.ErrorMessages.TooManyimagesError);

//         const imageArrayLength = (doc.data()?.images.length + 1);

//         const form = formidable({multiples: true});
//         form.parse(req, async (err, files) => {
//             const file = files.fileToUpload;
//             if (err || !file) {
//               res.status(500).send(err);
//               return;
//             }
//             const filePath = file[0];
//             const filename = `profile_photo_${imageArrayLength}.jpg`;
//             const bucket = admin.storage().bucket();

//             const options = {
//               destination: `images/users/${data.userId}/` + filename,
//               contentType: 'image/jpeg',
//             };

//             await bucket
//               .upload(filePath, options)
//               .then((output) => {
//                 return res.status(200).send(output);
//               })
//               .catch((error) => res.status(500).send(error));
//           });
//     })
//     .catch((error) => {
//         return res.status(400).send(error);
//     });

//     // return res.status(400).send('Unexpected Error');
// });
