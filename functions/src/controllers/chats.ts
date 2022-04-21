/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import * as xml from 'xml';
import * as admin from 'firebase-admin';
import * as util from '../utils/constans';
import * as functions from 'firebase-functions';

import * as cors from 'cors';
const corsHandler = cors({origin: true});

function getPayForChatsScreen(name: string) {
    const doc = [{
        doc: [
            {
                _attr: {
                    title: util.FunctionsConstants.Binu,
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
                                    _cdata: `Chat with ${name}`,
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
                                    _cdata: 'Want to chat?',
                                },
                            },
                            {
                                description: {
                                    _cdata: 'Become a premium member',
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
                                    _cdata: 'Click to pay R1 for a day',
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    }];

    return xml(doc, true);
}

function getChatPayScreenForRecipient(name: string, age: string, location: string, image: string) {
    const doc = [{
        doc: [
            {
                _attr: {
                    title: util.FunctionsConstants.Binu,
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
                                    _cdata: `${name} hasn't paid, so you can't chat to each other.`,
                                },
                            },
                        ],
                    },
                    {
                        item: [
                            {
                                _attr: {
                                    style: '',
                                    layout: 'relative',
                                },
                            },
                            {
                                img: {
                                    _attr: {
                                        url: image.length > 0 ? image : util.FunctionsConstants.DefualtImage,
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
                                            _cdata: name,
                                        },
                                    },
                                    {
                                        description: {
                                            _cdata: age,
                                        },
                                    },
                                    {
                                        description: {
                                            _cdata: location,
                                        },
                                    },
                                ],
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
                                    _cdata: 'You can pay for her!',
                                },
                            },
                            {
                                description: {
                                    _cdata: 'Click to pay R1 for a day',
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    }];

    return xml(doc, true);
}

async function checkSubscription(id: string, recipientId: string) : Promise<boolean> {
    try {
        const chatId = id.concat('_').concat(recipientId);

        const doc = await admin.firestore()
        .collection(util.FunctionsConstants.Users)
        .doc(id)
        .collection(util.FunctionsConstants.Chats)
        .doc(chatId)
        .get();

        if (!doc.exists) return false;

        const subscriptionDoc = await admin.firestore()
        .collection(util.FunctionsConstants.Subscriptions)
        .doc(doc.data()?.chatsPaymentID)
        .get();

        if (!subscriptionDoc.exists) return false;

        const now = admin.firestore.Timestamp.now();
        if (subscriptionDoc.data()?.expiryDate > now) return true;
        return false;
    } catch (error) {
        console.error(util.ErrorMessages.ErrorText, error);
        return false;
    }
}

const getChat = async (req:functions.https.Request, res: functions.Response) => {
    corsHandler(req, res, async () => {
        try {
            const queryId = req.query.id ?? '';
            const formattedId = Array.isArray(queryId) ? queryId[0] : queryId;
            const uid = formattedId.toString();

            const queryUid = req.query.uid ?? '';
            const formattedUid = Array.isArray(queryUid) ? queryUid[0] : queryUid;
            const uidString = formattedUid.toString();

            const userDocument = await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).get();

            if (!userDocument.exists) {
                res.status(400).send(util.ErrorMessages.NoUserError);
                return;
            }

            const chatId = uid.concat('_').concat(uidString);

            if (!checkSubscription(uid, uidString)) {
                const xmlData = getPayForChatsScreen(userDocument.data()?.name);
                res.status(200).send(xmlData);
                return;
            }

            if (!checkSubscription(uidString, uid)) {
                const recipientDoc = await admin.firestore().collection(util.FunctionsConstants.Users).doc(uidString).get();
                const xmlData = getChatPayScreenForRecipient(recipientDoc.data()?.name, recipientDoc.data()?.age, recipientDoc.data()?.location, recipientDoc.data()?.images[0]);
                res.status(200).send(xmlData);
                return;
            }

            await admin.firestore().collection(util.FunctionsConstants.Users)
            .doc(uid)
            .collection(util.FunctionsConstants.Chats)
            .doc(chatId)
            .collection(util.FunctionsConstants.Messages)
            .orderBy(util.FunctionsConstants.Timestamp)
            .limit(20)
            .get()
            .then((docs) => {
                if (docs.empty) return [];

                const docsArray = [];
                for (const doc of docs.docs) {
                    docsArray.push(doc.data());
                }
                res.status(200).send(docsArray);
                return;
            });
        } catch (error) {
            console.error(util.ErrorMessages.ErrorText, error);
            res.status(404).send(util.ErrorMessages.UnexpectedExrror);
            return;
        }
    });
};

const getMatches = async (req:functions.https.Request, res: functions.Response) => {
    corsHandler(req, res, async () => {
        try {
            const queryId = req.query.id ?? '';
            const formattedId = Array.isArray(queryId) ? queryId[0] : queryId;
            const uid = formattedId.toString();

            const userDocument = await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).get();

            if (!userDocument.exists) {
                res.status(400).send(util.ErrorMessages.NoUserError);
                return;
            }

            await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).collection(util.FunctionsConstants.Chats)
            .get()
            .then((docs) => {
                if (docs.empty) return res.status(400).send(util.ErrorMessages.NoUserError);

                const docsArray = [];
                for (const doc of docs.docs) {
                    docsArray.push(doc.data());
                }


                res.status(200).send(docsArray);
                return;
            });
        } catch (error) {
            console.error(util.ErrorMessages.ErrorText, error);
            res.status(404).send(util.ErrorMessages.UnexpectedExrror);
            return;
        }
    });
};

const getMatchesXML = async (req:functions.https.Request, res: functions.Response) => {
    corsHandler(req, res, async () => {
        const queryId = req.query.id ?? '';
        const formattedId = Array.isArray(queryId) ? queryId[0] : queryId;
        const uid = formattedId.toString();

        await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).collection(util.FunctionsConstants.Chats)
        .get()
        .then((docs) => {
            if (docs.empty) {
                res.status(400).send(util.ErrorMessages.NoUserError);
                return;
            }

            const usersList: any = [];
            for (const doc of docs.docs) {
                const item = {
                    item: [
                        {
                            _attr: {
                                style: '',
                                href: `http://localhost:5001/umtuwam/us-central1/getChat?uid=${doc.data().id}`,
                                layout: 'relative',
                            },
                        },
                        {
                            img: {
                                _attr: {
                                    url: doc.data().imageUrl != '' ? doc.data().imageUrl : util.FunctionsConstants.DefualtImage,
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
                            title: util.FunctionsConstants.Binu,
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
            return;
        })
        .catch((error) => {
            console.error(util.ErrorMessages.ErrorText, error);
            res.status(404).send(util.ErrorMessages.UnexpectedExrror);
            return;
        });
    });
};

const sendMessage = async (req:functions.https.Request, res: functions.Response) => {
    corsHandler(req, res, async () => {
        try {
            const queryId = req.query.id ?? '';
            const formattedId = Array.isArray(queryId) ? queryId[0] : queryId;
            const uid = formattedId.toString();

            const userDocument = await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).get();

            if (!userDocument.exists) {
                res.status(400).send(util.ErrorMessages.NoUserError);
                return;
            }


            const queryUid = req.query.uid ?? '';
            const formattedUid = Array.isArray(queryUid) ? queryUid[0] : queryUid;
            const uidString = formattedUid.toString();

            const chatId = uid.concat('_').concat(uidString);
            const timestamp = admin.firestore.Timestamp.now();

            await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).collection(util.FunctionsConstants.Chats).doc(chatId).collection(util.FunctionsConstants.Messages)
            .doc()
            .set({
                idFrom: uid,
                idTo: uidString,
                timestamp: timestamp,
                content: req.query.content,
            });

            const chatId2 = uidString.concat('_').concat(uid);

            await admin.firestore().collection(util.FunctionsConstants.Users).doc(uidString).collection(util.FunctionsConstants.Chats).doc(chatId2).collection(util.FunctionsConstants.Messages)
            .doc()
            .set({
                idFrom: uid,
                idTo: uidString,
                timestamp: timestamp,
                content: req.query.content,
            });


            res.status(200).send(util.SuccessMessages.SuccessMessage);
            return;
        } catch (error) {
            console.error(util.ErrorMessages.ErrorText, error);
            res.status(404).send(util.ErrorMessages.UnexpectedExrror);
            return;
        }
    });
};

const likeUser = async (req:functions.https.Request, res: functions.Response) => {
    corsHandler(req, res, async () => {
        try {
            const queryId = req.query.id ?? '';
            const formattedId = Array.isArray(queryId) ? queryId[0] : queryId;
            const uid = formattedId.toString();

            const userDocument = await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).get();

            if (!userDocument.exists) {
                res.status(400).send(util.ErrorMessages.NoUserError);
                return;
            }


            const queryUid = req.query.uid ?? '';
            const formattedUid = Array.isArray(queryUid) ? queryUid[0] : queryUid;
            const uidString = formattedUid.toString();


            const userB = uidString;
            const userBdoc = await admin.firestore().collection(util.FunctionsConstants.Users).doc(userB).get();

            const docId = userB.concat('_').concat(uid);
            const docId2 = uid.concat('_').concat(userB);

            await admin.firestore().collection(util.FunctionsConstants.Likes).doc(docId).get()
            .then(async (doc) => {
                if (!doc.exists) {
                    await admin.firestore().collection(util.FunctionsConstants.Likes).doc(docId2).set({
                        userA: uid,
                        userB: userB,
                    });
                } else {
                    await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).collection(util.FunctionsConstants.Chats).doc(docId2).set({
                        id: userB,
                        chatsPaymentID: '',
                        imagesPaymentID: '',
                        name: userBdoc.data()?.name,
                        imageUrl: userBdoc.data()?.images.length > 0 ? userBdoc.data()?.images[0] : util.FunctionsConstants.DefualtImage,
                    });
                    await admin.firestore().collection(util.FunctionsConstants.Users).doc(userB).collection(util.FunctionsConstants.Chats).doc(docId).set({
                        id: uid,
                        chatsPaymentID: '',
                        imagesPaymentID: '',
                        name: userDocument.data()?.name,
                        imageUrl: userDocument.data()?.images.length > 0 ? userDocument.data()?.images[0] : util.FunctionsConstants.DefualtImage,
                    });
                    await admin.firestore().collection(util.FunctionsConstants.Likes).doc(docId).delete();
                }
            });


            res.status(200).send(util.SuccessMessages.SuccessMessage);
            return;
        } catch (error) {
            console.error(util.ErrorMessages.ErrorText, error);
            res.status(404).send(util.ErrorMessages.UnexpectedExrror);
            return;
        }
    });
};

export {
    getChat,
    likeUser,
    getMatches,
    sendMessage,
    getMatchesXML,
    getPayForChatsScreen,
    getChatPayScreenForRecipient,
};
