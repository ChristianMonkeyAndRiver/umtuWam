/* eslint-disable @typescript-eslint/no-explicit-any */
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as appController from './controllers/app';
import * as testController from './utils/testData';
import * as util from './utils/constans';
import * as userController from './controllers/user';
import * as chatsController from './controllers/chats';
import * as reportController from './controllers/report';
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

exports.getStartup = functions.https.onRequest(appController.getStartup);

exports.reportsView = functions.https.onRequest(appController.reportsView);

exports.paymentsView = functions.https.onRequest(appController.paymentsView);

exports.getChatsView = functions.https.onRequest(appController.getChatsView);

exports.getImageView = functions.https.onRequest(appController.getImageView);

exports.getGalleryView = functions.https.onRequest(appController.getGalleryView);

exports.getProfileView = functions.https.onRequest(appController.getProfileView);

exports.viewUserProfile = functions.https.onRequest(appController.viewUserProfile);

exports.viewChatProfile = functions.https.onRequest(appController.viewChatProfile);

exports.getPreferencesView = functions.https.onRequest(appController.getPreferencesView);

exports.getProspectiveDates = functions.https.onRequest(appController.getProspectiveDates);

exports.getMembershipPageXML = functions.https.onRequest(appController.getMembershipPageXML);

exports.getProspectiveDatesXML = functions.https.onRequest(appController.getProspectiveDatesXML);

// =====================================================================================================================

exports.getChat = functions.https.onRequest(chatsController.getChat);

exports.likeUser = functions.https.onRequest(chatsController.likeUser);

exports.unlikeUser = functions.https.onRequest(chatsController.unlikeUser);

exports.getMatches = functions.https.onRequest(chatsController.getMatches);

exports.getMatchesXML = functions.https.onRequest(chatsController.getMatchesXML);

exports.sendMessage = functions.https.onRequest(chatsController.sendMessage);

// =====================================================================================================================

exports.createMySubscription = functions.https.onRequest(paymentsController.createMySubscription);

exports.createOtherSubscription = functions.https.onRequest(paymentsController.createOtherSubscription);

exports.subscriptionCallBackUrl = functions.https.onRequest(paymentsController.subscriptionCallBackUrl);

// =====================================================================================================================

exports.reportUser = functions.https.onRequest(reportController.reportUser);


exports.reportCreation = functions.firestore.document(`${util.FunctionsConstants.Reports}/{docId}`)
  .onCreate(async (snap) => {
    const newDoc = snap.data();

    const userDoc = await admin.firestore().collection(util.FunctionsConstants.Users).doc(newDoc.transgressorId).get();

    snap.ref.set({
      name: userDoc.data()?.name,
      gender: userDoc.data()?.gender,
      bio: userDoc.data()?.bio,
      images: userDoc.data()?.images,
      location: userDoc.data()?.location,
    }, {merge: true});
  });

// =====================================================================================================================

exports.uploadImages = functions.https.onRequest(async (req, res) => {
  const data = req.body;
  const queryId = req.query.id ?? '';
  const formattedId = Array.isArray(queryId) ? queryId[0] : queryId;
  const uid = formattedId.toString();

  console.log('============================');
  console.log(uid);
  console.log('============================');
  console.log(data);
  console.log('============================');

  const buffer = Buffer.from( data );

  await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).get()
  .then(async (doc) => {
      if (!doc.exists) {
         res.status(500).send(util.ErrorMessages.NoUserError);
         return;
      }
      if (doc.data()?.images.length == 5) {
        res.status(500).send(util.ErrorMessages.TooManyimagesError);
        return;
      }

      const imageArrayLength = (doc.data()?.images.length + 1);

      const filename = `images/users/${uid}/profile_photo_${imageArrayLength}.jpeg`;
      const bucket = admin.storage().bucket();
      const file = bucket.file(filename);

      const options = {resumable: false, metadata: {contentType: 'image/jpeg'}};

      return file.save(buffer, options)
      .then(() => {
          return file.getSignedUrl({
              action: 'read',
              expires: '03-09-2500',
            });
      })
      .then((urls) => {
          const url = urls[0];
          doc.ref.update({
            images: admin.firestore.FieldValue.arrayUnion(url),
          });
          res.send(util.SuccessMessages.SuccessMessage);
          return;
      });
  })
  .catch((error) => {
    console.error(util.ErrorMessages.ErrorText, error);
    res.status(404).send(util.ErrorMessages.UnexpectedExrror);
    return;
  });
});

// =====================================================================================================================
exports.testFindUser = functions.https.onRequest(paymentsController.testFindUser);

 // =====================================================================================================================

exports.createDB = functions.runWith({
    timeoutSeconds: 540,
    memory: '512MB',
  }).https.onRequest(testController.createDB);

exports.createChats = functions.runWith({
    timeoutSeconds: 540,
    memory: '512MB',
  }).https.onRequest(testController.createChats);

exports.boostFunction = functions.runWith({
    timeoutSeconds: 540,
    memory: '512MB',
  }).https.onRequest(testController.boostFunction);

exports.verifyFunction = functions.runWith({
    timeoutSeconds: 540,
    memory: '512MB',
  }).https.onRequest(testController.verifyFunction);

  exports.createDummyReports = functions.runWith({
    timeoutSeconds: 540,
    memory: '512MB',
  }).https.onRequest(testController.createDummyReports);

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
//         return res.status(500).send(error);
//     });
//     return res.status(200).send({
//         'imageUrl': url,
//     });
// })
// .catch((error) => {
//     return res.status(500).send(error);
// });
