/* eslint-disable @typescript-eslint/no-explicit-any */
import * as admin from 'firebase-admin';
import * as util from '../utils/constans';
import * as functions from 'firebase-functions';
import { faker } from '@faker-js/faker';

export default functions.runWith({
    timeoutSeconds: 540,
    memory: '512MB',
}).https.onRequest(async (req, res) => {
    await admin.firestore().collection(util.FunctionsConstants.Users).limit(30).get()
        .then(async (users) => {
            for (const doc of users.docs) {
                const potentialMatches = await getPotentialMatches(doc.id);

                for (const potentialMatch of potentialMatches) {
                    const randomNumber = Math.floor(Math.random() * 4);

                    if (randomNumber == 0) {
                        await likeUser({ id: doc.id, ...doc.data() }, potentialMatch);
                    } else if (randomNumber == 1) {
                        await paidChat({ id: doc.id, ...doc.data() }, potentialMatch);
                    } else if (randomNumber == 2) {
                        await halfPaidChat({ id: doc.id, ...doc.data() }, potentialMatch);
                    } else {
                        await payForImage({ id: doc.id, ...doc.data() }, potentialMatch);
                    }
                }
            }
            res.status(200).send(util.SuccessMessages.SuccessMessage);
            return;
        })
        .catch((error) => {
            console.error(util.ErrorMessages.ErrorText, error);
            res.status(404).send(util.ErrorMessages.UnexpectedExrror);
            return;
        });
});

async function getPotentialMatches(id: string): Promise<any[]> {
    const docsArray: any[] | PromiseLike<any[]> = [];

    await admin.firestore().collection(util.FunctionsConstants.Preferences).doc(id).get()
        .then(async (doc) => {
            if (!doc.exists) {
                throw new Error(util.ErrorMessages.NoUserError);
            }

            await admin.firestore().collection(util.FunctionsConstants.Users)
                .where(util.FunctionsConstants.IsBanned, '==', false)
                .where(util.FunctionsConstants.Gender, 'in', doc.data()?.gender)
                .where(util.FunctionsConstants.GenderPreference, '==', doc.data()?.genderPreference)
                .where(util.FunctionsConstants.Age, '>=', doc.data()?.ageMin)
                .where(util.FunctionsConstants.Age, '<=', doc.data()?.ageMax)
                .where(util.FunctionsConstants.Location, '==', doc.data()?.location)
                .orderBy(util.FunctionsConstants.Age, 'asc')
                .orderBy(util.FunctionsConstants.Points, 'desc')
                .limit(20)
                .get()
                .then(async (docs) => {
                    if (docs.empty) {
                        await doc.ref.update({ currentIndex: '' });
                        return [];
                    } else {
                        for (const document of docs.docs) {
                            if (document.id != doc.id) {
                                docsArray.push({
                                    id: document.id,
                                    ...document.data(),
                                });
                            }
                        }
                        // const currentIndex = doc.data()?.currentIndex + docs.docs.length;

                        // await doc.ref.update({
                        //     currentIndex: currentIndex,
                        // });
                        return docsArray;
                    }
                });
        });

    return docsArray;
}

async function likeUser(user1: any, user2: any) {
    const docId = user1.id.concat('_').concat(user2.id);
    const docId2 = user2.id.concat('_').concat(user1.id);

    await admin.firestore().collection(util.FunctionsConstants.Users).doc(user1.id).collection(util.FunctionsConstants.Chats).doc(docId).set({
        id: user2.id,
        name: user2.name,
        imageUrl: user2.images[0] ?? util.FunctionsConstants.DefualtImage,
    });
    await admin.firestore().collection(util.FunctionsConstants.Users).doc(user2.id).collection(util.FunctionsConstants.Chats).doc(docId2).set({
        id: user1.id,
        name: user1.name,
        imageUrl: user1.images[0] ?? util.FunctionsConstants.DefualtImage,
    });
}

async function paidChat(user1: any, user2: any) {
    const docId = user1.id.concat('_').concat(user2.id);
    const docId2 = user2.id.concat('_').concat(user1.id);
    const paymentId = faker.datatype.uuid();
    const paymentId2 = faker.datatype.uuid();

    await admin.firestore().collection(util.FunctionsConstants.Users).doc(user1.id).collection(util.FunctionsConstants.Chats).doc(docId).set({
        id: user2.id,
        name: user2.name,
        imageUrl: user2.images[0] ?? util.FunctionsConstants.DefualtImage,
    });

    await admin.firestore().collection(util.FunctionsConstants.Users).doc(user2.id).collection(util.FunctionsConstants.Chats).doc(docId2).set({
        id: user1.id,
        name: user1.name,
        imageUrl: user1.images[0] ?? util.FunctionsConstants.DefualtImage,
    });
    const timestamp = admin.firestore.Timestamp.now();
    let counter = 0;

    for (const message of userTestChat) {
        await admin.firestore().collection(util.FunctionsConstants.Users).doc(user1.id).collection(util.FunctionsConstants.Chats).doc(docId).collection(util.FunctionsConstants.Messages)
            .doc()
            .set({
                idFrom: counter % 2 == 0 ? user1.id : user2.id,
                idTo: counter % 2 == 0 ? user2.id : user1.id,
                timestamp: timestamp,
                content: message.content,
            });

        await admin.firestore().collection(util.FunctionsConstants.Users).doc(user2.id).collection(util.FunctionsConstants.Chats).doc(docId2).collection(util.FunctionsConstants.Messages)
            .doc()
            .set({
                idFrom: counter % 2 == 0 ? user1.id : user2.id,
                idTo: counter % 2 == 0 ? user2.id : user1.id,
                timestamp: timestamp,
                content: message.content,
            });
        counter++;
    }

    const now = admin.firestore.Timestamp.now();
    const expiresAt = new admin.firestore.Timestamp(now.seconds + 24 * 60 * 60, now.nanoseconds);

    await admin.firestore().collection(util.FunctionsConstants.Subscriptions).doc().set({
        purchaserId: user1.id,
        paymentId: paymentId,
        expiresAt: expiresAt,
        isPaymentApproved: true,
        product: util.Products.Chats,
    });

    await admin.firestore().collection(util.FunctionsConstants.Subscriptions).doc().set({
        purchaserId: user2.id,
        paymentId: paymentId2,
        expiresAt: expiresAt,
        isPaymentApproved: true,
        product: util.Products.Chats,
    });

    await admin.firestore().collection(util.FunctionsConstants.Users).doc(user1.id).update({ chatsExpiryDate: expiresAt, hasPaidForChats: true });

    await admin.firestore().collection(util.FunctionsConstants.Users).doc(user2.id).update({ chatsExpiryDate: expiresAt, hasPaidForChats: true });
}

async function halfPaidChat(user1: any, user2: any) {
    const docId = user1.id.concat('_').concat(user2.id);
    const docId2 = user2.id.concat('_').concat(user1.id);
    const paymentId = faker.datatype.uuid();

    await admin.firestore().collection(util.FunctionsConstants.Users).doc(user1.id).collection(util.FunctionsConstants.Chats).doc(docId).set({
        id: user2.id,
        name: user2.name,
        imageUrl: user2.images[0] ?? util.FunctionsConstants.DefualtImage,
    });

    await admin.firestore().collection(util.FunctionsConstants.Users).doc(user2.id).collection(util.FunctionsConstants.Chats).doc(docId2).set({
        id: user1.id,
        name: user1.name,
        imageUrl: user1.images[0] ?? util.FunctionsConstants.DefualtImage,
    });

    const now = admin.firestore.Timestamp.now();
    const expiresAt = new admin.firestore.Timestamp(now.seconds + 24 * 60 * 60, now.nanoseconds);
    await admin.firestore().collection(util.FunctionsConstants.Subscriptions).doc().set({
        purchaserId: user1.id,
        paymentId: paymentId,
        expiresAt: expiresAt,
        isPaymentApproved: true,
        product: util.Products.Chats,
    });

    await admin.firestore().collection(util.FunctionsConstants.Users).doc(user1.id).update({ chatsExpiryDate: expiresAt, hasPaidForChats: true });
}

async function payForImage(user1: any, user2: any) {
    const docId = user1.id.concat('_').concat(user2.id);

    const paymentId = faker.datatype.uuid();
    const now = admin.firestore.Timestamp.now();
    const expiresAt = new admin.firestore.Timestamp(now.seconds + 24 * 60 * 60 * 100000, now.nanoseconds);

    admin.firestore().collection(util.FunctionsConstants.Subscriptions).doc(docId).set({
        purchaserId: user1.id,
        paymentId: paymentId,
        expiresAt: expiresAt,
        isPaymentApproved: true,
        product: util.Products.Photos,
    });
}

const userTestChat = [
    {
        'content': 'Hi',
        'senderId': 'John Doe_Johannesburg',
        'recipientId': 'Susan Taylor_Johannesburg',
    },
    {
        'content': 'How are you?',
        'senderId': 'Susan Taylor_Johannesburg',
        'recipientId': 'John Doe_Johannesburg',
    },
    {
        'content': 'Im all good now girl :)',
        'senderId': 'John Doe_Johannesburg',
        'recipientId': 'Susan Taylor_Johannesburg',
    },
    {
        'content': 'Ohh really now ?',
        'senderId': 'Susan Taylor_Johannesburg',
        'recipientId': 'John Doe_Johannesburg',
    },
    {
        'content': 'Yeah girl fr! why wouldnt I be excited, speaking to a fine ting like yourself!!',
        'senderId': 'John Doe_Johannesburg',
        'recipientId': 'Susan Taylor_Johannesburg',
    },
    {
        'content': 'psshhh you probably say that to all the girls. SO dont even try that shit with me.',
        'senderId': 'Susan Taylor_Johannesburg',
        'recipientId': 'John Doe_Johannesburg',
    },
    {
        'content': 'Youre right I say it to all the girls, but only the ones I actually like. And rn that person is you.',
        'senderId': 'John Doe_Johannesburg',
        'recipientId': 'Susan Taylor_Johannesburg',
    },
    {
        'content': 'ncaww fr?!',
        'senderId': 'Susan Taylor_Johannesburg',
        'recipientId': 'John Doe_Johannesburg',
    },
    {
        'content': 'yeah baby girl fr fr',
        'senderId': 'John Doe_Johannesburg',
        'recipientId': 'Susan Taylor_Johannesburg',
    },
    {
        'content': 'So what you been up to then',
        'senderId': 'Susan Taylor_Johannesburg',
        'recipientId': 'John Doe_Johannesburg',
    },

    {
        'content': 'just chillin, been a slow day wby?',
        'senderId': 'John Doe_Johannesburg',
        'recipientId': 'Susan Taylor_Johannesburg',
    },


];
