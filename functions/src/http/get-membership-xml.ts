import * as xml from 'xml';
import * as cors from 'cors';
import * as admin from 'firebase-admin';
import * as util from '../utils/constants';
import * as functions from 'firebase-functions';

const corsHandler = cors({ origin: true });

export default functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        const queryId = req.query.id ?? '';
        const formattedId = Array.isArray(queryId) ? queryId[0] : queryId;
        const uid = formattedId.toString();
        const userDocument = await admin.firestore().collection(util.FunctionsConstants.Users).doc(uid).get();

        if (!userDocument.exists) {
            res.status(500).send(util.ErrorMessages.NoUserError);
            return;
        }

        const now = admin.firestore.Timestamp.now();

        const chatTimeDiff = now.seconds - userDocument.data()?.chatsAndPhotosExpiryDate.seconds ?? 0;
        let daysDifference = Math.floor(chatTimeDiff / 1000 / 60*30);
        const isChatAndPhotosSubscriptionValid = (userDocument.data()?.hasPaidForChatsAndPhotos && daysDifference < 0);

        const featuredTimeDiff = now.seconds - userDocument.data()?.featuredExpiryDate.seconds ?? 0;
        daysDifference = Math.floor(featuredTimeDiff / 1000 / 60);
        const isFeaturedSubscriptionValid = (userDocument.data()?.hasPaidForFeatured && featuredTimeDiff < 0);


        const isVerified = userDocument.data()?.isVerified;
        const doc = [{
            doc: [
                {
                    _attr: {
                        title: util.FunctionsConstants.UmtuWam,
                    },
                },
                {
                    list: [
                        {
                            item: [
                                {
                                    _attr: {
                                        style: '',
                                        href: '',
                                        layout: 'relative',
                                    },
                                },
                                {
                                    md: util.FunctionsConstants.Membership,
                                },
                            ],
                        },
                        {
                            item: [
                                {
                                    _attr: {
                                        style: '',
                                        href: isChatAndPhotosSubscriptionValid ? '' : `https://us-central1-umtuwam.cloudfunctions.net/http-paymentsView?id=${uid}&uid=${''}&product=${util.Products.ChatsAndPhotos}&isMine=${true}&amount=${util.Prices.ChatsAndPhotos}`,
                                        layout: 'relative',
                                    },
                                },
                                {
                                    md: isChatAndPhotosSubscriptionValid ? 'Chat and Photos subscription is currently active' : `${util.FunctionsConstants.ChatsAndPhotos}: ${util.FunctionsConstants.ClickToPayChatsAndPhotos}`,
                                },
                            ],
                        },
                        {
                            item: [
                                {
                                    _attr: {
                                        style: '',
                                        href: isFeaturedSubscriptionValid ? '' : `https://us-central1-umtuwam.cloudfunctions.net/http-paymentsView?id=${uid}&uid=${''}&product=${util.Products.Boost}&isMine=${true}&amount=${util.Prices.Boost}`,
                                        layout: 'relative',
                                    },
                                },
                                {
                                    md: isFeaturedSubscriptionValid ? 'Boost subscription is currently active' : `${util.FunctionsConstants.Boost}: ${util.FunctionsConstants.ClickToPayFeatured}`,
                                },
                            ],
                        },
                        !isVerified ? {
                            item: [
                                {
                                    _attr: {
                                        style: '',
                                        href: `https://us-central1-umtuwam.cloudfunctions.net/http-paymentsView?id=${uid}&uid=${''}&product=${util.Products.Verified}&isMine=${true}&amount=${util.Prices.Verified}`,
                                        layout: 'relative',
                                    },
                                },
                                {
                                    md: `${util.FunctionsConstants.Verified}: ${util.FunctionsConstants.ClickToPayVerified}`,
                                },
                            ],
                        } : {},
                    ],
                },
            ],
        }];
        res.set('Content-Type', 'application/xml');

        res.status(200).send(xml(doc, { declaration: { standalone: 'yes', encoding: 'UTF-8' } }));
        return;
    });
});


// isChatSubscriptionValid ? {
//     item: [
//         {
//             _attr: {
//                 style: '',
//                 href: `https://us-central1-umtuwam.cloudfunctions.net/http-paymentsView?id=${uid}&uid=${''}&product=${util.Products.ChatsAndPhotos}&isMine=${true}&amount=15`,
//                 layout: 'relative',
//             },
//         },
//         {
//             md: `${util.FunctionsConstants.Chatting}: ${util.FunctionsConstants.ClickToPayChatsMonth}`,
//         },
//     ],
// } : {},
