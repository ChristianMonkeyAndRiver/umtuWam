/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import * as xml from 'xml';
import * as admin from 'firebase-admin';
import * as formidable from 'formidable';
import * as functions from 'firebase-functions';

admin.initializeApp();

exports.signUp = functions.https.onRequest((req, res) => {
    const phoneNumber = '0748956221';

    const name = 'name';
    const gender = 'gender';
    const lookingFor = 'lookingFor';
    const age = 'age';
    const location = 'location';
    const nameIndex = req.url.indexOf(name);
    const genderIndex = req.url.indexOf(gender);
    const lookingForIndex = req.url.indexOf(lookingFor);
    const ageIndex = req.url.indexOf(age);
    const locationIndex = req.url.indexOf(location);

    const nameString = req.url.substring(nameIndex+name.length+1, genderIndex-1);

    const genderString = req.url.substring(genderIndex+gender.length+1, lookingForIndex-1);

    const lookingForString = req.url.substring(lookingForIndex+lookingFor.length+1, ageIndex-1);

    const ageString = req.url.substring(ageIndex+age.length+1, locationIndex-1);

    const locationString = req.url.substring(locationIndex+location.length+1);

    const ageNumber = Number(ageString);

    const ageMin = ageNumber - 5;
    const ageMax = ageNumber + 5;

    admin.firestore().collection('users').doc().set({
        age: ageString,
        name: nameString,
        bio: '',
        gender: genderString,
        images: ['https://firebasestorage.googleapis.com/v0/b/umtuwam.appspot.com/o/logos%2Fprofile_logo.png?alt=media&token=8163c425-06f0-485f-9e35-dde862ce0c53'],
        location: locationString,
        lookingFor: lookingForString,
        phoneNumber: phoneNumber,
    });

    admin.firestore().collection('preferences').doc().set({
        gender: lookingForString,
        location: locationString,
        ageMin: ageMin.toString(),
        ageMax: ageMax.toString(),
        phoneNumber: phoneNumber,
    });

    res.send('Done');
    // const email = req.body.email;
    // const password = req.body.password;
    // const phoneNumber = req.body.phoneNumber;

    // admin.auth().createUser({
    //     email: email,
    //     emailVerified: false,
    //     phoneNumber: phoneNumber,
    //     password: password,
    //     disabled: false,
    // })
    // .then((userRecord) => {
    //     console.log('Successfully created new user:', userRecord.uid);
    //     return res.status(200).send(userRecord);
    // })
    // .catch((error) => {
    //     console.log('Error creating new user:', error);
    //     res.status(400).send(error);
    // });
});

exports.getUser = functions.https.onRequest(async (req, res) => {
    const phoneNumber = '0748956221';


    await admin.firestore().collection('users').where('phoneNumber', '==', phoneNumber).get()
    .then(async (docs) =>{
        if (docs.empty) return res.status(400).send('No user found');

        await admin.firestore().collection('users').doc(docs.docs[0].id).get()
        .then((doc) => {
            return res.send(doc.data());
        });
    })
    .catch(() => {
        return res.status(400).send('Error');
    });
});

exports.updateUser = functions.https.onRequest(async (req, res) => {
    const phoneNumber = '0748956221';
    const name = 'name';
    const bio = 'bio';
    const gender = 'gender';
    const lookingFor = 'lookingFor';
    const age = 'age';
    const location = 'location';
    const bioIndex = req.url.indexOf(bio);
    const nameIndex = req.url.indexOf(name);
    const genderIndex = req.url.indexOf(gender);
    const lookingForIndex = req.url.indexOf(lookingFor);
    const ageIndex = req.url.indexOf(age);
    const locationIndex = req.url.indexOf(location);

    const nameString = req.url.substring(nameIndex+name.length+1, bioIndex-1);

    const bioString = req.url.substring(bioIndex+bio.length+1, genderIndex-1);

    const genderString = req.url.substring(genderIndex+gender.length+1, lookingForIndex-1);

    const lookingForString = req.url.substring(lookingForIndex+lookingFor.length+1, ageIndex-1);

    const ageString = req.url.substring(ageIndex+age.length+1, locationIndex-1);

    const locationString = req.url.substring(locationIndex+location.length+1);

    await admin.firestore().collection('users').where('phoneNumber', '==', phoneNumber).get()
    .then(async (docs) =>{
        if (docs.empty) return res.status(400).send('No user found');

        await admin.firestore().collection('users').doc(docs.docs[0].id).update({
            age: ageString == '-1' ? docs.docs[0].data().age : ageString,
            bio: bioString == '-1' ? docs.docs[0].data().bio : bioString,
            name: nameString == '-1' ? docs.docs[0].data().name : nameString,
            gender: genderString == '-1' ? docs.docs[0].data().gender : genderString,
            location: locationString == '-1' ? docs.docs[0].data().location : locationString,
            lookingFor: lookingForString == '-1' ? docs.docs[0].data().lookingFor : lookingForString,
        });
    })
    .catch(() => {
        return res.status(400).send('Error');
    });

    await admin.firestore().collection('preferences').where('phoneNumber', '==', phoneNumber).get()
    .then(async (docs) =>{
        if (docs.empty) return res.status(400).send('No user found');

        await admin.firestore().collection('preferences').doc(docs.docs[0].id).update({
            location: locationString == '-1' ? docs.docs[0].data().location : locationString,
            gender: lookingForString == '-1' ? docs.docs[0].data().gender : lookingForString,
        });
       return res.status(200).send('User successfully updated');
    })
    .catch((error) => {
        return res.status(400).send(error);
    });
});

exports.getPreferences = functions.https.onRequest(async (req, res) => {
    const phoneNumber = '0748956221';

    await admin.firestore().collection('preferences').where('phoneNumber', '==', phoneNumber).get()
    .then(async (docs) =>{
        if (docs.empty) return res.status(400).send('No user found');

        await admin.firestore().collection('preferences').doc(docs.docs[0].id).get()
        .then((doc) => {
            return res.send(doc.data());
        });
    })
    .catch(() => {
        return res.status(400).send('Error');
    });
});

exports.updatePreferences = functions.https.onRequest(async (req, res) =>{
    const phoneNumber = '0748956221';
    const ageMin = 'ageMin';
    const ageMax = 'ageMax';
    const gender = 'gender';
    const location = 'location';
    const ageMinIndex = req.url.indexOf(ageMin);
    const ageMaxIndex = req.url.indexOf(ageMax);
    const genderIndex = req.url.indexOf(gender);
    const locationIndex = req.url.indexOf(location);

    const ageMinString = req.url.substring(ageMinIndex+ageMin.length+1, ageMaxIndex-1);

    const ageMaxString = req.url.substring(ageMaxIndex+ageMax.length+1, genderIndex-1);

    const genderString = req.url.substring(genderIndex+gender.length+1, locationIndex-1);

    const locationString = req.url.substring(locationIndex+location.length+1);

    await admin.firestore().collection('preferences').where('phoneNumber', '==', phoneNumber).get()
    .then(async (docs) =>{
        if (docs.empty) return res.status(400).send('No user found');

        await admin.firestore().collection('preferences').doc(docs.docs[0].id).update({
            ageMin: ageMinString == '-1' ? docs.docs[0].data().ageMax : ageMinString,
            ageMax: ageMaxString == '-1' ? docs.docs[0].data().ageMax : ageMaxString,
            gender: genderString == '-1' ? docs.docs[0].data().gender : genderString,
            location: locationString == '-1' ? docs.docs[0].data().location : locationString,
        });
       return res.status(200).send('User successfully updated');
    })
    .catch((error) => {
        return res.status(400).send(error);
    });
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
                id: userB,
                name: data.userBName,
                imageUrl: data.userBName,
            });
            await admin.firestore().collection('users').doc(userB).collection('chats').doc(docId).set({
                id: userA,
                name: data.userAName,
                imageUrl: data.userAName,
            });
            await admin.firestore().collection('likes').doc(docId).delete();
        }
    })
    .catch((error) =>{
        console.error('error:' + error);
        return res.status(400).send();
    });
});

exports.getUserXML = functions.https.onRequest(async (req, res) => {
    const data = req.body;

    await admin.firestore().collection('users').doc(data.userId).get()
     .then((document) =>{
        if (!document.exists) return res.status(400).send('No user found');


            const doc = [{
                doc: [
                    {
                        _attr: {
                            title: 'biNu',
                        },
                    },
                    {
                        img: {
                            _attr: {
                                url: 'https://firebasestorage.googleapis.com/v0/b/umtuwam.appspot.com/o/logos%2Fprofile_logo.png?alt=media&token=8163c425-06f0-485f-9e35-dde862ce0c53',
                            },
                        },
                    },
                    {
                        md: [
                            {
                                _attr: {
                                    style: '',
                                },
                            },
                            {
                                description: {
                                    _cdata: document.data()?.name,
                                },
                            },
                            {
                                description: {
                                    _cdata: document.data()?.age,
                                },
                            },
                        ],
                    },
                    {
                        md: [
                            {
                                _attr: {
                                    style: '',
                                },
                            },
                            {
                                description: {
                                    _cdata: document.data()?.location,
                                },
                            },
                        ],
                    },
                    {
                        md: [
                            {
                                _attr: {
                                    style: '',
                                },
                            },
                            {
                                description: {
                                    _cdata: document.data()?.bio,
                                },
                            },
                        ],
                    },
                ],
            }];

            res.send(xml(doc, true));
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

exports.getPropectiveDatesXML = functions.https.onRequest(async (req, res) => {
    const data = req.body;

    await admin.firestore().collection('preferences').doc(data.userId).get()
    .then(async (doc) => {
        if (!doc.exists) return res.status(400).send('No user found');

        await admin.firestore().collection('users')
            .where('gender', '==', doc.data()?.gender)
            .where('age', '>=', doc.data()?.ageMin)
            .where('age', '<=', doc.data()?.ageMax)
            .where('location', '==', doc.data()?.location)
            .limit(20)
            .get()
            .then((docs) => {
                if (docs.empty) return res.status(400).send('No dates found');

                const usersList: any = [];

                for (const doc of docs.docs) {
                    const item = {
                        item: [
                            {
                                _attr: {
                                    style: '',
                                    href: '',
                                    layout: 'relative',
                                },
                            },
                            {
                                img: {
                                    _attr: {
                                        url: doc.data().images.length > 0 ? doc.data().images[0] : 'https://firebasestorage.googleapis.com/v0/b/umtuwam.appspot.com/o/logos%2Fprofile_logo.png?alt=media&token=8163c425-06f0-485f-9e35-dde862ce0c53',
                                    },
                                },
                            },
                            {
                                md: [
                                    {
                                        _attr: {
                                            style: '',
                                        },
                                    },
                                    {
                                        description: {
                                            _cdata: doc.data().name,
                                        },
                                    },
                                    {
                                        description: {
                                            _cdata: doc.data().age,
                                        },
                                    },
                                    {
                                        description: {
                                            _cdata: doc.data().location,
                                        },
                                    },
                                ],
                            },
                        ],
                    };
                    usersList.push(item);
                }

                const doc = [{
                    doc: [
                        {
                            _attr: {
                                title: 'biNu',
                            },
                        },
                        {
                            list: [
                                ...usersList,
                            ],
                        },
                    ],
                }];

                res.send(xml(doc, true));
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
        if (docs.empty) return res.status(400).send('No user found');

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

exports.getChatsXML = functions.https.onRequest(async (req, res) => {
    const data = req.body;

    await admin.firestore().collection('users').doc(data.userId).collection('chats')
    .get()
    .then((docs) => {
        if (docs.empty) return res.status(400).send('No user found');

        const usersList: any = [];
        for (const doc of docs.docs) {
            const item = {
                item: [
                    {
                        _attr: {
                            style: '',
                            href: '',
                            layout: 'relative',
                        },
                    },
                    {
                        img: {
                            _attr: {
                                url: doc.data().imageUrl != '' ? doc.data().imageUrl : 'https://firebasestorage.googleapis.com/v0/b/umtuwam.appspot.com/o/logos%2Fprofile_logo.png?alt=media&token=8163c425-06f0-485f-9e35-dde862ce0c53',
                            },
                        },
                    },
                    {
                        md: [
                            {
                                _attr: {
                                    style: '',
                                },
                            },
                            {
                                description: {
                                    _cdata: doc.data().name,
                                },
                            },

                        ],
                    },
                ],
            };
            usersList.push(item);
        }

        const doc = [{
            doc: [
                {
                    _attr: {
                        title: 'biNu',
                    },
                },
                {
                    list: [
                        ...usersList,
                    ],
                },
            ],
        }];

        res.send(xml(doc, true));
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

exports.getApp = functions.https.onRequest((req, res) => {
    const app = [{
        App: [
            {
                _attr: {
                    logo: 'https://firebasestorage.googleapis.com/v0/b/umtuwam.appspot.com/o/logos%2Flogo.png?alt=media&token=4fc9ed08-3832-4727-a2aa-717cda834193',
                    styleurl: '',
                },
            },
            {
                bottom_nav: [
                    {
                        menuItem: [
                            {
                                _attr: {
                                    img: 'https://firebasestorage.googleapis.com/v0/b/umtuwam.appspot.com/o/logos%2Flogo.png?alt=media&token=4fc9ed08-3832-4727-a2aa-717cda834193',
                                    href: '',
                                },
                            },
                            'UmuntuWam',
                        ],
                    },
                    {
                        menuItem: [
                            {
                                _attr: {
                                    img: 'https://firebasestorage.googleapis.com/v0/b/umtuwam.appspot.com/o/logos%2Fchat_logo.png?alt=media&token=55adfc03-d2b8-4b65-bf26-707f4cd5cd16',
                                    href: '',
                                },
                            },
                            'Chats',
                        ],
                    },
                    {
                        menuItem: [
                            {
                                _attr: {
                                    img: 'https://firebasestorage.googleapis.com/v0/b/umtuwam.appspot.com/o/logos%2Fprofile_logo.png?alt=media&token=8163c425-06f0-485f-9e35-dde862ce0c53',
                                    href: '',
                                },
                            },
                            'Profile',
                        ],
                    },
                ],
            },
            {
                Menu: [
                    {
                        menuItem: [
                            {
                                _attr: {
                                    action: 'usage',
                                },
                            },
                            'About',
                        ],
                    },
                    {
                        menuItem: [
                            {
                                _attr: {
                                    action: 'share',
                                },
                            },
                            'Share Moya',
                        ],
                    },
                    {
                        menuItem: [
                            {
                                _attr: {
                                    action: 'rate',
                                },
                            },
                            'Rate Moya',
                        ],
                    },
                ],
            },
            {
                share: {
                    _attr: {
                        action: 'send',
                        title: 'Moya',
                        text: 'Check out the Moya #datafree super-app! I use it for #datafree chat and many other services. Even better, it works when you have no airtime or data balance. Get it from https://moya.app/dl/',
                        subject: 'Moya #datafree app',
                    },
                },
            },
        ],
    }];

    res.send(xml(app, true));
});

exports.getUsersXml = functions.https.onRequest(async (req, res) => {
    const usersList: any = [];
    await admin.firestore().collection('users').get()
    .then((docs) =>{
       if (!docs.empty) {
            for (const doc of docs.docs) {
                const item = {
                    item: [
                        {
                            _attr: {
                                style: '',
                                href: '',
                                layout: 'relative',
                            },
                        },
                        {
                            img: {
                                _attr: {
                                    url: 'https://firebasestorage.googleapis.com/v0/b/umtuwam.appspot.com/o/logos%2Fprofile_logo.png?alt=media&token=8163c425-06f0-485f-9e35-dde862ce0c53',
                                },
                            },
                        },
                        {
                            md: [
                                {
                                    _attr: {
                                        style: '',
                                    },
                                },
                                {
                                    description: {
                                        _cdata: doc.data().email,
                                    },
                                },
                            ],
                        },
                    ],
                };
                usersList.push(item);
            }
            const doc = [{
                doc: [
                    {
                        _attr: {
                            title: 'biNu',
                        },
                    },
                    {
                        list: [
                            ...usersList,
                        ],
                    },
                ],
            }];

            res.send(xml(doc, true));
       } else {
            return res.status(400).send('No users found');
       }
   })
   .catch((error) => {
       return res.status(400).send(error);
   });
});

exports.getMembershipPageXML = functions.https.onRequest(async (req, res) => {
    const doc = [{
        doc: [
            {
                _attr: {
                    title: 'UmuntuWam',
                },
            },
            {
                list: [
                    {
                        md: [
                            {
                                _attr: {
                                    style: '',
                                },
                            },
                            {
                                description: {
                                    _cdata: 'Membership',
                                },
                            },
                        ],
                    },
                    {
                        hr: [],
                    },
                    {
                        md: [
                            {
                                _attr: {
                                    style: '',
                                },
                            },
                            {
                                description: {
                                    _cdata: 'Chatting',
                                },
                            },
                        ],
                    },
                   {
                        a: [
                            {
                                _attr: {
                                    href: '',
                                },
                            },
                            'Click to pay R1 to chat for a day',
                        ],
                   },
                   {
                        md: [
                            {
                                _attr: {
                                    style: '',
                                },
                            },
                            {
                                description: {
                                    _cdata: 'Featured profile',
                                },
                            },
                        ],
                    },
                    {
                        a: [
                            {
                                _attr: {
                                    href: '',
                                },
                            },
                            'Click to pay R1 to be boosted in searches for a day',
                        ],
                    },
                    {
                        md: [
                            {
                                _attr: {
                                    style: '',
                                },
                            },
                            {
                                description: {
                                    _cdata: 'See all photos',
                                },
                            },
                        ],
                    },
                   {
                        a: [
                            {
                                _attr: {
                                    href: '',
                                },
                            },
                            'Click to pay R1 to see all profile photos',
                        ],
                   },
                   {
                        md: [
                            {
                                _attr: {
                                    style: '',
                                },
                            },
                            {
                                description: {
                                    _cdata: 'Verified profile',
                                },
                            },
                        ],
                    },
                    {
                        a: [
                            {
                                _attr: {
                                    href: '',
                                },
                            },
                            'Click to pay R1 to show a VERIFIED badge on your profile',
                        ],
                    },
                ],
            },
        ],
    }];

    res.send(xml(doc, true));
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
