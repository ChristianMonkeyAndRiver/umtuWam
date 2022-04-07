import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as formidable from 'formidable';


admin.initializeApp();

exports.signUp = functions.https.onRequest((req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const phoneNumber = req.body.phoneNumber;

    admin.auth().createUser({
        email: email,
        emailVerified: false,
        phoneNumber: phoneNumber,
        password: password,
        disabled: false,
    })
    .then((userRecord) => {
        console.log('Successfully created new user:', userRecord.uid);
        return res.status(200).send(userRecord);
    })
    .catch((error) => {
        console.log('Error creating new user:', error);
        res.status(400).send(error);
    });
});

exports.newUserSignUp = functions.auth.user().onCreate(async (user) => {
     const userId = user.uid;
    admin.firestore().collection('users').doc(userId).set({
        age: 18,
        name: '',
        bio: '',
        gender: '',
        images: [],
        location: '',
        lookingFor: '',
        email: user.email ?? '',
        phoneNumber: user.phoneNumber ?? '',
    });

    admin.firestore().collection('preferences').doc(userId).set({
        gender: '',
        location: '',
        ageMin: 18,
        ageMax: 40,
    });
});

exports.userDeleted = functions.auth.user().onDelete(async (user) => {
    await admin.firestore().collection('users').doc(user.uid).delete();
    await admin.firestore().collection('preferences').doc(user.uid).delete();

    return;
});

exports.likeUser = functions.https.onRequest(async (req, res) => {
    const data = req.body;

    const userA = data.userA;
    const userB = data.userB;

    const docId = userB.concat('_').concat(userA);
    const docId2 = userA.concat('_').concat(userB);

    await admin.firestore().collection('likes').doc(docId).get()
    .then(async (doc) => {
        if (!doc.exists) {
            await admin.firestore().collection('likes').doc(docId2).set({
                userA: userA,
                userB: userB,
                userAName: data.userAName,
                userBName: data.userBName,
            });
        } else {
            await admin.firestore().collection('users').doc(userA).collection('chats').doc(docId2).set({
                userB: userB,
                userBName: data.userBName,
            });
            await admin.firestore().collection('users').doc(userB).collection('chats').doc(docId).set({
                userA: userA,
                userAName: data.userAName,
            });
            await admin.firestore().collection('likes').doc(docId).delete();
        }
    })
    .catch((error) =>{
        console.error('error:' + error);
        return res.status(400).send();
    });
});

exports.getUser = functions.https.onRequest(async (req, res) => {
    const data = req.body;

    await admin.firestore().collection('users').doc(data.userId).get()
     .then((doc) =>{
        return res.status(200).send(doc.data());
    })
    .catch((error) => {
        return res.status(400).send(error);
    });
});

exports.updateUser = functions.https.onRequest(async (req, res) => {
    const data = req.body;

    await admin.firestore().collection('users').doc(data.userId).update({
        age: data.age,
        bio: data.bio,
        name: data.name,
        gender: data.gender,
        location: data.location,
        lookingFor: data.lookingFor,
    })
    .then(() =>{
        res.status(200).send('User successfully updated');
    })
    .catch((error) => {
        return res.status(400).send(error);
    });
});

exports.getPreferences = functions.https.onRequest(async (req, res) => {
    const data = req.body;

    await admin.firestore().collection('preferences').doc(data.userId).get()
    .then((doc) =>{
        return res.status(200).send(doc.data());
    })
    .catch((error) => {
        return res.status(400).send(error);
    });
});

exports.updatePreferences = functions.https.onRequest(async (req, res) => {
    const data = req.body;

    await admin.firestore().collection('preferences').doc(data.userId).update({
        ageMax: data.ageMax,
        ageMin: data.ageMin,
        gender: data.gender,
        location: data.location,
    })
    .then(() =>{
        res.status(200).send('Preferences successfully updated');
    })
    .catch((error) => {
        return res.status(400).send(error);
    });
});

exports.getPropectiveDates = functions.https.onRequest(async (req, res) => {
    const data = req.body;

    await admin.firestore().collection('preferences').doc(data.userId).get()
    .then(async (doc) => {
        if (!doc.exists) return;

        await admin.firestore().collection('users')
            .where('gender', '==', doc.data()?.gender)
            .where('age', '>=', doc.data()?.ageMin)
            .where('age', '<=', doc.data()?.ageMax)
            .where('location', '==', doc.data()?.location)
            .limit(20)
            .get()
            .then((docs) => {
                if (docs.empty) return res.status(400).send('No dates found');

                const docsArray = [];
                for (const doc of docs.docs) {
                    docsArray.push(doc.data());
                }

                return res.status(200).send(docsArray);
            })
            .catch((error) => {
                console.error('error:' + error);
                return res.status(400).send(error);
            });
    })
    .catch((error) => {
        console.error('error:' + error);
        return res.status(400).send(error);
    });
});

exports.getChats = functions.https.onRequest(async (req, res) => {
    const data = req.body;

    await admin.firestore().collection('users').doc(data.userId).collection('chats')
    .get()
    .then((docs) => {
        if (docs.empty) return;

        const docsArray = [];
        for (const doc of docs.docs) {
            docsArray.push(doc.data());
        }

        return res.status(200).send(docsArray);
    })
    .catch((error) => {
        console.error('error:' + error);
        return res.status(400).send(error);
    });
});

exports.getChat = functions.https.onRequest(async (req, res) => {
    const data = req.body;

    const chatId = data.userId.concat('_').concat(data.userB);

    await admin.firestore().collection('users').doc(data.userId).collection('chats').doc(chatId).collection('messages')
    .orderBy('timestamp')
    .limit(20)
    .get()
    .then((docs) => {
        if (docs.empty) return res.status(404).send('No docs found');

        const docsArray = [];
        for (const doc of docs.docs) {
            docsArray.push(doc.data());
        }

        res.status(200).send(docsArray);
    })
    .catch((error) => {
        console.error('error:' + error);
        res.status(404).send(error);
    });
});

exports.sendMessage = functions.https.onRequest(async (req, res) => {
    const data = req.body;

    const chatId = data.senderId.concat('_').concat(data.recipientId);
    const timestamp = admin.firestore.Timestamp.now();

    await admin.firestore().collection('users').doc(data.senderId).collection('chats').doc(chatId).collection('messages')
    .doc()
    .set({
        idFrom: data.senderId,
        idTo: data.recipientId,
        timestamp: timestamp,
        content: data.content,
    });

    const chatId2 = data.recipientId.concat('_').concat(data.senderId);

    await admin.firestore().collection('users').doc(data.recipientId).collection('chats').doc(chatId2).collection('messages')
    .doc()
    .set({
        idFrom: data.senderId,
        idTo: data.recipientId,
        timestamp: timestamp,
        content: data.content,
    })
    .then(async (doc) => {
        return res.send(200).send(doc);
     })
    .catch((error) => {
        console.error('error:' + error);
        return res.status(400).send(error);
    });
});

exports.uploadImages = functions.https.onRequest(async (req, res) => {
    const data = req.body;

    await admin.firestore().collection('users').doc(data.userId).get()
    .then(async (doc) => {
        if (!doc.exists) return res.status(400).send('Not Found');

        if (doc.data()?.images.length == 5) return res.status(400).send('Too many images upload');

        const imageArrayLength = (doc.data()?.images.length + 1);

        const form = formidable({multiples: true});
        form.parse(req, async (err, files) => {
            const file = files.fileToUpload;
            if (err || !file) {
              res.status(500).send(err);
              return;
            }
            const filePath = file[0];
            const filename = `profile_photo_${imageArrayLength}.jpg`;
            const bucket = admin.storage().bucket();

            const options = {
              destination: `images/users/${data.userId}/` + filename,
              contentType: 'image/jpeg',
            };

            await bucket
              .upload(filePath, options)
              .then((output) => {
                return res.status(200).send(output);
              })
              .catch((error) => res.status(500).send(error));
          });
    })
    .catch((error) => {
        return res.status(400).send(error);
    });

    // return res.status(400).send('Unexpected Error');
});

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
//     await admin.firestore().collection('users').doc(data.userId).update({
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
